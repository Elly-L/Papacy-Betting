"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, LabelList } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { useBetting } from "@/context/betting-context"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState, useRef } from "react"
import { Flame, TrendingUp, TrendingDown } from "lucide-react"

export function BettingStats() {
  const { bettingData, totalBets, trendingCandidate } = useBetting()
  const [animatedData, setAnimatedData] = useState(bettingData)
  const [changeStatus, setChangeStatus] = useState<Record<string, "increase" | "decrease" | null>>({})

  const prevDataRef = useRef<string>(JSON.stringify(bettingData))
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isProcessingRef = useRef<boolean>(false)

  // Animate data changes with debouncing
  useEffect(() => {
    // Skip if we're already processing an update
    if (isProcessingRef.current) return

    const currentDataString = JSON.stringify(bettingData)

    // Only update if the data has actually changed
    if (currentDataString !== prevDataRef.current) {
      isProcessingRef.current = true

      // Clear any pending update
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      // Detect changes and set animation status
      const newChangeStatus: Record<string, "increase" | "decrease" | null> = {}
      const prevData = JSON.parse(prevDataRef.current) as typeof bettingData

      bettingData.forEach((item) => {
        const prevItem = prevData.find((prev) => prev.name === item.name)
        if (prevItem) {
          if (item.bets > prevItem.bets) {
            newChangeStatus[item.name] = "increase"
          } else if (item.bets < prevItem.bets) {
            newChangeStatus[item.name] = "decrease"
          }
        }
      })

      // Update state with debouncing
      updateTimeoutRef.current = setTimeout(() => {
        setChangeStatus(newChangeStatus)
        setAnimatedData(bettingData)
        prevDataRef.current = currentDataString

        // Clear animation status after a delay
        const clearTimer = setTimeout(() => {
          setChangeStatus({})
          isProcessingRef.current = false
        }, 2000)

        return () => clearTimeout(clearTimer)
      }, 200) // Debounce updates
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [bettingData])

  // Get bar color based on change status
  const getBarColor = (name: string, defaultColor: string) => {
    const status = changeStatus[name]
    if (status === "increase") return "#10b981" // green
    if (status === "decrease") return "#ef4444" // red
    return defaultColor
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 flex-wrap">
            Total Bets by Candidate
            {trendingCandidate && (
              <Badge className="ml-2 bg-amber-500 hover:bg-amber-600">
                <Flame className="h-3 w-3 mr-1" /> Trending: {trendingCandidate}
              </Badge>
            )}
          </CardTitle>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            {totalBets.toLocaleString()} Total Bets
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] overflow-x-auto">
            <ChartContainer
              config={{
                bets: {
                  label: "Number of Bets",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={animatedData}
                  layout="vertical"
                  margin={{ top: 20, right: 50, left: 150, bottom: 20 }}
                  minWidth={800} // Ensure minimum width for mobile scrolling
                >
                  <XAxis type="number" tick={{ fontSize: 14 }} tickFormatter={(value) => value.toLocaleString()} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 14 }} width={150} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-4 border rounded shadow-md">
                            <p className="font-medium text-lg">{data.name}</p>
                            <p className="text-base mt-1">{data.bets.toLocaleString()} bets</p>
                            <p className="text-sm text-gray-500 mt-1">{data.percentage}% of total bets</p>
                            {data.name === trendingCandidate && (
                              <div className="flex items-center gap-1 text-amber-500 mt-2">
                                <Flame className="h-4 w-4" />
                                <span className="font-medium">Trending</span>
                              </div>
                            )}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="bets"
                    radius={[0, 6, 6, 0]}
                    className="transition-all duration-500"
                    animationDuration={500}
                    barSize={30}
                  >
                    {animatedData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={getBarColor(entry.name, entry.color)}
                        className={`${changeStatus[entry.name] === "increase" ? "animate-pulse" : ""}`}
                      />
                    ))}
                    <LabelList
                      dataKey="bets"
                      position="right"
                      formatter={(value) => value.toLocaleString()}
                      style={{ fill: "#374151", fontWeight: 500, fontSize: 14 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Betting Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {animatedData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium truncate">{item.name}</span>
                    {item.name === trendingCandidate && <Flame className="h-4 w-4 text-amber-500" />}
                    {changeStatus[item.name] === "increase" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {changeStatus[item.name] === "decrease" && <TrendingDown className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base text-gray-700">{item.percentage}%</span>
                    <span className="text-sm text-red-700 font-medium">({item.odds.toFixed(2)})</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden group relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      changeStatus[item.name] === "increase" ? "animate-pulse" : ""
                    }`}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: getBarColor(item.name, item.color),
                    }}
                  />
                </div>
                <div className="text-sm text-gray-500">{item.bets.toLocaleString()} bets</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
