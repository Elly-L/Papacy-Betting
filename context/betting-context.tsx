"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react"

// Define the candidate type
export type Candidate = {
  id: number
  name: string
  nationality: string
  age: number
  odds: number
  image: string
  momentum: number
}

// Define the betting data type
export type BettingData = {
  name: string
  bets: number
  percentage: number
  odds: number
  color: string
  momentum: number
  previousBets: number
}

// Initial candidates data
const initialCandidates = [
  {
    id: 1,
    name: "Pietro Parolin",
    nationality: "Italian",
    age: 70,
    odds: 1.85,
    image: "/images/pietro-parolin.png",
    momentum: 0,
  },
  {
    id: 2,
    name: "Luis Antonio Gokim Tagle",
    nationality: "Filipino",
    age: 67,
    odds: 2.1,
    image: "/images/luis-antonio-tagle.png",
    momentum: 0,
  },
  {
    id: 3,
    name: "Fridolin Ambongo Besungu",
    nationality: "Congolese",
    age: 65,
    odds: 2.35,
    image: "/images/fridolin-ambongo.png",
    momentum: 0,
  },
  {
    id: 4,
    name: "Peter Kodwo Appiah Turkson",
    nationality: "Ghanaian",
    age: 76,
    odds: 2.5,
    image: "/images/peter-turkson.png",
    momentum: 0,
  },
  {
    id: 5,
    name: "Peter Erdo",
    nationality: "Hungarian",
    age: 72,
    odds: 2.75,
    image: "/images/peter-erdo.png",
    momentum: 0,
  },
  {
    id: 6,
    name: "Angelo Scola",
    nationality: "Italian",
    age: 83,
    odds: 2.9,
    image: "/images/angelo-scola.png",
    momentum: 0,
  },
  {
    id: 7,
    name: "Reinhard Marx",
    nationality: "German",
    age: 71,
    odds: 3.1,
    image: "/images/reinhard-marx.png",
    momentum: 0,
  },
  {
    id: 8,
    name: "Robert Prevost",
    nationality: "American",
    age: 69,
    odds: 3.25,
    image: "/images/robert-prevost.png",
    momentum: 0,
  },
  {
    id: 9,
    name: "Pierbattista Pizzaballa",
    nationality: "Italian",
    age: 60,
    odds: 3.4,
    image: "/images/pierbattista-pizzaballa.png",
    momentum: 0,
  },
  {
    id: 10,
    name: "Michael Czerny",
    nationality: "Canadian",
    age: 78,
    odds: 3.5,
    image: "/images/michael-czerny.png",
    momentum: 0,
  },
]

// Colors for the bar chart
const chartColors = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#84cc16", // lime
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#d946ef", // fuchsia
  "#ec4899", // pink
]

// Initialize betting data with random values and colors
const createInitialBettingData = () => {
  return initialCandidates.map((candidate, index) => {
    const initialBets = Math.floor(Math.random() * 500) + 100
    return {
      name: candidate.name,
      bets: initialBets,
      previousBets: initialBets,
      percentage: 0, // Will be calculated
      odds: candidate.odds,
      color: chartColors[index % chartColors.length],
      momentum: 0,
    }
  })
}

// Calculate percentages based on total bets
const calculatePercentages = (data: BettingData[]): BettingData[] => {
  const totalBets = data.reduce((sum, item) => sum + item.bets, 0)
  return data.map((item) => ({
    ...item,
    percentage: totalBets > 0 ? Math.round((item.bets / totalBets) * 100) : 0,
  }))
}

// Define the context type
type BettingContextType = {
  candidates: Candidate[]
  bettingData: BettingData[]
  totalBets: number
  placeBet: (candidateName: string, amount: number) => void
  getCandidate: (name: string) => Candidate | undefined
  simulationSpeed: number
  setSimulationSpeed: (speed: number) => void
  simulationActive: boolean
  toggleSimulation: () => void
  trendingCandidate: string | null
}

// Create the context
const BettingContext = createContext<BettingContextType | undefined>(undefined)

// Provider component
export function BettingProvider({ children }: { children: ReactNode }) {
  // Use refs for state that shouldn't trigger re-renders
  const candidatesRef = useRef<Candidate[]>(initialCandidates)
  const bettingDataRef = useRef<BettingData[]>(calculatePercentages(createInitialBettingData()))
  const totalBetsRef = useRef<number>(bettingDataRef.current.reduce((sum, item) => sum + item.bets, 0))
  const simulationSpeedRef = useRef<number>(1)
  const simulationActiveRef = useRef<boolean>(true)
  const trendingCandidateRef = useRef<string | null>(null)

  // State for UI updates - these will trigger re-renders
  const [candidates, setCandidates] = useState<Candidate[]>(candidatesRef.current)
  const [bettingData, setBettingData] = useState<BettingData[]>(bettingDataRef.current)
  const [totalBets, setTotalBets] = useState<number>(totalBetsRef.current)
  const [simulationSpeed, setSimulationSpeed] = useState<number>(simulationSpeedRef.current)
  const [simulationActive, setSimulationActive] = useState<boolean>(simulationActiveRef.current)
  const [trendingCandidate, setTrendingCandidate] = useState<string | null>(trendingCandidateRef.current)

  // Additional refs for simulation
  const momentumRef = useRef<Record<string, number>>({})
  const lastUpdateRef = useRef<Record<string, number>>({})
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const trendingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const updateUITimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isUpdatingRef = useRef<boolean>(false)

  // Initialize momentum for all candidates
  useEffect(() => {
    initialCandidates.forEach((candidate) => {
      momentumRef.current[candidate.name] = 0
      lastUpdateRef.current[candidate.name] = Date.now()
    })
  }, [])

  // Function to update UI state from refs - batched to prevent excessive re-renders
  const updateUIFromRefs = useCallback(() => {
    if (isUpdatingRef.current) return

    isUpdatingRef.current = true

    // Clear any pending updates
    if (updateUITimeoutRef.current) {
      clearTimeout(updateUITimeoutRef.current)
    }

    // Schedule the update
    updateUITimeoutRef.current = setTimeout(() => {
      setCandidates([...candidatesRef.current])
      setBettingData([...bettingDataRef.current])
      setTotalBets(totalBetsRef.current)
      setTrendingCandidate(trendingCandidateRef.current)
      isUpdatingRef.current = false
    }, 50) // Reduced from 100ms to 50ms for more responsive updates
  }, [])

  // Function to place a bet - updates refs directly
  const placeBet = useCallback(
    (candidateName: string, amount: number) => {
      // Update betting data ref
      bettingDataRef.current = bettingDataRef.current.map((item) => {
        if (item.name === candidateName) {
          // Update momentum
          const newMomentum = Math.min((item.momentum || 0) + 1, 5)
          momentumRef.current[candidateName] = newMomentum

          return {
            ...item,
            previousBets: item.bets,
            bets: item.bets + amount,
            momentum: newMomentum,
          }
        }
        return item
      })

      // Recalculate percentages
      bettingDataRef.current = calculatePercentages(bettingDataRef.current)

      // Update total bets ref
      totalBetsRef.current += amount

      // Update candidate momentum in ref
      candidatesRef.current = candidatesRef.current.map((candidate) => {
        if (candidate.name === candidateName) {
          return {
            ...candidate,
            momentum: Math.min((candidate.momentum || 0) + 1, 5),
          }
        }
        return candidate
      })

      // Record the last update time
      lastUpdateRef.current[candidateName] = Date.now()

      // Randomly set a trending candidate
      if (Math.random() < 0.1 && candidateName !== trendingCandidateRef.current) {
        trendingCandidateRef.current = candidateName

        // Clear previous timeout
        if (trendingTimeoutRef.current) {
          clearTimeout(trendingTimeoutRef.current)
        }

        // Clear trending status after some time
        trendingTimeoutRef.current = setTimeout(() => {
          trendingCandidateRef.current = null
          updateUIFromRefs()
        }, 30000) // 30 seconds
      }

      // Update UI state from refs
      updateUIFromRefs()
    },
    [updateUIFromRefs],
  )

  // Function to get a candidate by name
  const getCandidate = useCallback((name: string) => {
    return candidatesRef.current.find((candidate) => candidate.name === name)
  }, [])

  // Function to set simulation speed
  const handleSetSimulationSpeed = useCallback((speed: number) => {
    simulationSpeedRef.current = speed
    setSimulationSpeed(speed)

    // Restart simulation with new speed if active
    if (simulationActiveRef.current && simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current)
      startSimulation()
    }
  }, [])

  // Function to toggle simulation
  const toggleSimulation = useCallback(() => {
    const newState = !simulationActiveRef.current
    simulationActiveRef.current = newState
    setSimulationActive(newState)

    if (newState) {
      startSimulation()
    } else if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current)
      simulationIntervalRef.current = null
    }
  }, [])

  // Function to start the simulation
  const startSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current)
    }

    const simulateBets = () => {
      if (!simulationActiveRef.current) return

      // Decay momentum over time
      Object.keys(momentumRef.current).forEach((name) => {
        const lastUpdate = lastUpdateRef.current[name] || 0
        const timeSinceUpdate = Date.now() - lastUpdate

        // Decay momentum if it's been a while since the last bet
        if (timeSinceUpdate > 5000 && momentumRef.current[name] > 0) {
          momentumRef.current[name] = Math.max(0, momentumRef.current[name] - 0.5)

          // Update candidate momentum in ref
          candidatesRef.current = candidatesRef.current.map((candidate) => {
            if (candidate.name === name) {
              return {
                ...candidate,
                momentum: momentumRef.current[name],
              }
            }
            return candidate
          })
        }
      })

      // Determine which candidates get bets in this round
      const betsThisRound = Math.floor(Math.random() * 3) + 1 // 1-3 bets per round

      for (let i = 0; i < betsThisRound; i++) {
        // Weighted selection based on momentum and trending status
        const weightedCandidates = candidatesRef.current.map((candidate) => {
          const momentum = momentumRef.current[candidate.name] || 0
          const isTrending = candidate.name === trendingCandidateRef.current

          // Calculate weight based on momentum, trending status, and a random factor
          let weight = 1 + momentum * 2 + (isTrending ? 5 : 0)

          // Add randomness
          weight *= 0.8 + Math.random() * 0.4 // 0.8-1.2 random multiplier

          return {
            name: candidate.name,
            weight,
          }
        })

        // Calculate total weight
        const totalWeight = weightedCandidates.reduce((sum, c) => sum + c.weight, 0)

        // Select a candidate based on weights
        let random = Math.random() * totalWeight
        let selectedCandidate = weightedCandidates[0].name

        for (const candidate of weightedCandidates) {
          random -= candidate.weight
          if (random <= 0) {
            selectedCandidate = candidate.name
            break
          }
        }

        // Determine bet amount - trending candidates get larger bets
        const isTrending = selectedCandidate === trendingCandidateRef.current
        const momentum = momentumRef.current[selectedCandidate] || 0
        const baseAmount = Math.floor(Math.random() * 20) + 5 // 5-25 base amount
        const momentumBonus = Math.floor(momentum * 5) // Up to 25 bonus from momentum
        const trendingBonus = isTrending ? Math.floor(Math.random() * 50) + 25 : 0 // 25-75 bonus if trending

        const betAmount = baseAmount + momentumBonus + trendingBonus

        // Place the bet
        placeBet(selectedCandidate, betAmount)
      }
    }

    // Run simulation at a rate determined by simulation speed
    const interval = Math.floor(2000 / simulationSpeedRef.current)
    simulationIntervalRef.current = setInterval(simulateBets, interval)
  }, [placeBet])

  // Start/stop simulation based on active state
  useEffect(() => {
    if (simulationActiveRef.current) {
      startSimulation()
    }

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current)
      }
      if (trendingTimeoutRef.current) {
        clearTimeout(trendingTimeoutRef.current)
      }
      if (updateUITimeoutRef.current) {
        clearTimeout(updateUITimeoutRef.current)
      }
    }
  }, [startSimulation])

  return (
    <BettingContext.Provider
      value={{
        candidates,
        bettingData,
        totalBets,
        placeBet,
        getCandidate,
        simulationSpeed,
        setSimulationSpeed: handleSetSimulationSpeed,
        simulationActive,
        toggleSimulation,
        trendingCandidate,
      }}
    >
      {children}
    </BettingContext.Provider>
  )
}

// Custom hook to use the betting context
export function useBetting() {
  const context = useContext(BettingContext)
  if (context === undefined) {
    throw new Error("useBetting must be used within a BettingProvider")
  }
  return context
}
