"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useBetting } from "@/context/betting-context"
import { useEffect, useState, useRef } from "react"
import { TrendingUp, Award } from "lucide-react"

export function BettingCounter() {
  const { totalBets, bettingData, trendingCandidate } = useBetting()
  const [displayedTotal, setDisplayedTotal] = useState(totalBets)
  const [isAnimating, setIsAnimating] = useState(false)
  const [leadingCandidate, setLeadingCandidate] = useState<(typeof bettingData)[0] | null>(null)

  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const prevTotalRef = useRef(totalBets)
  const isUpdatingRef = useRef(false)

  // Find the leading candidate and update displayed total
  useEffect(() => {
    // Find leading candidate
    if (bettingData.length > 0) {
      const leader = bettingData.reduce((prev, current) => (current.bets > prev.bets ? current : prev))
      setLeadingCandidate(leader)
    }

    // Always update for any change, but animate only for significant changes
    if (totalBets !== prevTotalRef.current) {
      // Clear any existing animation
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }

      // For significant changes, animate
      if (Math.abs(totalBets - prevTotalRef.current) > 5) {
        setIsAnimating(true)

        // Calculate step size based on difference
        const diff = totalBets - prevTotalRef.current
        const steps = 10
        const step = Math.ceil(diff / steps)
        let current = prevTotalRef.current

        animationRef.current = setInterval(() => {
          current += step
          if ((step > 0 && current >= totalBets) || (step < 0 && current <= totalBets)) {
            clearInterval(animationRef.current as NodeJS.Timeout)
            setDisplayedTotal(totalBets)
            prevTotalRef.current = totalBets

            // Reset animation state after a delay
            setTimeout(() => {
              setIsAnimating(false)
            }, 500)
          } else {
            setDisplayedTotal(current)
          }
        }, 50)
      } else {
        // For small changes, just update directly without animation
        setDisplayedTotal(totalBets)
        prevTotalRef.current = totalBets
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }
    }
  }, [totalBets, bettingData])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white/90">Total Bets Placed</h3>
              <p
                className={`text-3xl font-bold mt-1 ${isAnimating ? "text-yellow-300" : "text-white"} transition-colors`}
              >
                {displayedTotal.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {leadingCandidate && (
        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white/90">Leading Candidate</h3>
                <p className="text-xl font-bold mt-1 truncate max-w-[180px]">{leadingCandidate.name}</p>
                <p className="text-sm text-white/80 mt-1">
                  {leadingCandidate.bets.toLocaleString()} bets ({leadingCandidate.percentage}%)
                </p>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
