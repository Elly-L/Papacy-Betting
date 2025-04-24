"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

export function Countdown() {
  // Set a fixed deadline date (15 days from a specific date)
  // This ensures everyone sees the same countdown regardless of when they load the app
  const [deadline] = useState(() => {
    // Set a fixed date for the conclave - e.g., May 15, 2025
    const fixedDeadline = new Date("2025-05-15T00:00:00Z")
    return fixedDeadline
  })

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = deadline.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  return (
    <Card className="bg-white border-red-200">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <Clock className="h-5 w-5" />
            <h3 className="font-semibold">Betting Closes When Conclave Begins</h3>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">{timeLeft.days}</span>
              <span className="text-sm text-gray-500">Days</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">{timeLeft.hours}</span>
              <span className="text-sm text-gray-500">Hours</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">{timeLeft.minutes}</span>
              <span className="text-sm text-gray-500">Minutes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">{timeLeft.seconds}</span>
              <span className="text-sm text-gray-500">Seconds</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
