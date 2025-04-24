import { Countdown } from "@/components/countdown"
import { CandidateGrid } from "@/components/candidate-grid"
import { BettingStats } from "@/components/betting-stats"
import { Badge } from "@/components/ui/badge"
import { LiveBettingFeed } from "@/components/live-betting-feed"
import { BettingCounter } from "@/components/betting-counter"
import { SimulationControls } from "@/components/simulation-controls"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-8 px-4 md:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center">Papal Election Betting</h1>
          <p className="text-center mt-3 text-white/90 max-w-2xl mx-auto">
            Place your bets on who will be elected as the next Pope. Betting closes when the conclave begins.
          </p>
          <div className="flex justify-center mt-6">
            <Badge className="bg-white/20 text-white hover:bg-white/30 transition-colors">
              Official Betting Platform
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Countdown />
          </div>
          <div>
            <SimulationControls />
          </div>
        </div>

        <div className="mt-8">
          <BettingCounter />
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Papal Candidates</h2>
            <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
              10 Cardinals
            </Badge>
          </div>
          <CandidateGrid />
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Betting Statistics</h2>
          <BettingStats />
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Betting Activity</h2>
          <LiveBettingFeed />
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 px-4 md:px-6 lg:px-8 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-400">This site is for entertainment purposes only.</p>
          <p className="text-sm text-gray-400 mt-2">© {new Date().getFullYear()} Papal Election Betting</p>
          <p className="text-sm text-gray-300 mt-3 font-medium">Developed by El~Tek</p>
        </div>
      </footer>
    </div>
  )
}
