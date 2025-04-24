"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useBetting } from "@/context/betting-context"
import { Play, Pause, Gauge, BarChart3 } from "lucide-react"
import { useState } from "react"

export function SimulationControls() {
  const { simulationSpeed, setSimulationSpeed, simulationActive, toggleSimulation, totalBets } = useBetting()
  const [showControls, setShowControls] = useState(false)

  // Handle speed change with debouncing
  const handleSpeedChange = (value: number[]) => {
    if (value[0] !== simulationSpeed) {
      setSimulationSpeed(value[0])
    }
  }

  return (
    <Card className="bg-white border-red-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-red-600" />
            <span className="font-medium">Betting Simulation</span>
          </div>

          <Button variant="outline" size="sm" onClick={() => setShowControls(!showControls)} className="text-xs">
            {showControls ? "Hide Controls" : "Show Controls"}
          </Button>
        </div>

        {showControls && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Simulation Status:</span>
              <Button
                variant={simulationActive ? "default" : "outline"}
                size="sm"
                onClick={toggleSimulation}
                className={simulationActive ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {simulationActive ? (
                  <div className="flex items-center gap-2">
                    <Pause className="h-4 w-4" />
                    <span>Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    <span>Paused</span>
                  </div>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Simulation Speed:</span>
                <div className="flex items-center gap-1">
                  <Gauge className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">
                    {simulationSpeed === 0.5 ? "Slow" : simulationSpeed === 1 ? "Normal" : "Fast"}
                  </span>
                </div>
              </div>

              <Slider
                defaultValue={[1]}
                min={0.5}
                max={2}
                step={0.5}
                value={[simulationSpeed]}
                onValueChange={handleSpeedChange}
                className="py-2"
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Bets Simulated:</span>
                <span className="font-medium">{totalBets.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
