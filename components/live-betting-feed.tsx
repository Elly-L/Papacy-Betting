"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBetting } from "@/context/betting-context"
import { Activity, Flame } from "lucide-react"

type BetActivity = {
  id: string
  candidateName: string
  amount: number
  timestamp: Date
  odds: number
  isTrending: boolean
}

export function LiveBettingFeed() {
  const { bettingData, trendingCandidate, simulationActive, simulationSpeed } = useBetting()
  const [activities, setActivities] = useState<BetActivity[]>([])
  const activityContainerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const bettingDataRef = useRef(bettingData)
  const trendingCandidateRef = useRef(trendingCandidate)
  const simulationActiveRef = useRef(simulationActive)
  const simulationSpeedRef = useRef(simulationSpeed)

  // Update refs when props change
  useEffect(() => {
    bettingDataRef.current = bettingData
    trendingCandidateRef.current = trendingCandidate
    simulationActiveRef.current = simulationActive
    simulationSpeedRef.current = simulationSpeed
  }, [bettingData, trendingCandidate, simulationActive, simulationSpeed])

  // Generate a random bet activity
  const generateRandomActivity = useCallback(() => {
    const currentBettingData = bettingDataRef.current
    const currentTrendingCandidate = trendingCandidateRef.current

    if (currentBettingData.length === 0) return null

    // Weight selection toward trending candidate
    let selectedCandidate
    if (currentTrendingCandidate && Math.random() < 0.3) {
      selectedCandidate = currentBettingData.find((item) => item.name === currentTrendingCandidate)
    }

    if (!selectedCandidate) {
      const randomIndex = Math.floor(Math.random() * currentBettingData.length)
      selectedCandidate = currentBettingData[randomIndex]
    }

    if (!selectedCandidate) return null

    // Generate random amount - higher for trending candidates
    const isTrending = selectedCandidate.name === currentTrendingCandidate
    const baseAmount = Math.floor(Math.random() * 900) + 100 // 100-1000 base
    const trendingBonus = isTrending ? Math.floor(Math.random() * 1000) + 500 : 0 // 500-1500 bonus if trending

    const amount = baseAmount + trendingBonus

    return {
      id: Math.random().toString(36).substring(2, 9),
      candidateName: selectedCandidate.name,
      amount,
      timestamp: new Date(),
      odds: selectedCandidate.odds,
      isTrending,
    }
  }, [])

  // Setup and cleanup the interval
  useEffect(() => {
    const setupInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      if (!simulationActiveRef.current || bettingDataRef.current.length === 0) return

      // Add initial activities if empty
      if (activities.length === 0) {
        const initialActivities = []
        for (let i = 0; i < 5; i++) {
          const activity = generateRandomActivity()
          if (activity) {
            // Stagger the timestamps
            activity.timestamp = new Date(Date.now() - i * 60000) // Each one is a minute older
            initialActivities.push(activity)
          }
        }
        setActivities(initialActivities)
      }

      // Set up interval for new activities
      const intervalTime = Math.floor(3000 / simulationSpeedRef.current)
      intervalRef.current = setInterval(() => {
        if (!simulationActiveRef.current) return

        const newActivity = generateRandomActivity()
        if (newActivity) {
          setActivities((prev) => {
            const updated = [newActivity, ...prev.slice(0, 19)] // Keep only the latest 20 activities
            return updated
          })
        }
      }, intervalTime)
    }

    setupInterval()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [generateRandomActivity, activities.length])

  // Update interval when simulation status changes
  useEffect(() => {
    simulationActiveRef.current = simulationActive
    simulationSpeedRef.current = simulationSpeed

    // Reset the interval with new settings
    if (intervalRef.current) {
      clearInterval(intervalRef.current)

      if (simulationActive) {
        const intervalTime = Math.floor(3000 / simulationSpeed)
        intervalRef.current = setInterval(() => {
          const newActivity = generateRandomActivity()
          if (newActivity) {
            setActivities((prev) => {
              const updated = [newActivity, ...prev.slice(0, 19)]
              return updated
            })
          }
        }, intervalTime)
      }
    }
  }, [simulationActive, simulationSpeed, generateRandomActivity])

  // Format time difference
  const formatTimeDiff = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            <span className="font-medium">Real-time Updates</span>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 animate-pulse">
            Live
          </Badge>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          ref={activityContainerRef}
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center justify-between p-4 bg-white rounded-lg border ${
                  activity.isTrending ? "border-amber-300 shadow-md" : "border-gray-100 shadow-sm"
                } hover:shadow-md transition-shadow`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-medium truncate max-w-[150px]">{activity.candidateName}</span>
                    {activity.isTrending && <Flame className="h-4 w-4 text-amber-500" />}
                  </div>
                  <span className="text-sm text-gray-500">{formatTimeDiff(activity.timestamp)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`font-bold ${activity.isTrending ? "text-amber-600" : "text-green-600"}`}>
                    KES {activity.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">Odds: {activity.odds.toFixed(2)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">No betting activity yet</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
