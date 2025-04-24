"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { CandidateDetails } from "./candidate-details"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, CreditCard } from "lucide-react"
import { useBetting } from "@/context/betting-context"

export function CandidateGrid() {
  const { candidates, placeBet } = useBetting()
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [betAmount, setBetAmount] = useState("")
  const [open, setOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [viewingCandidate, setViewingCandidate] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePlaceBet = (candidate) => {
    setSelectedCandidate(candidate)
    setOpen(true)
  }

  const handleConfirmBet = () => {
    if (!selectedCandidate || !betAmount) return

    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      // Place the bet in our context
      placeBet(selectedCandidate.name, Number.parseInt(betAmount, 10))

      // Show success toast
      toast({
        title: "Bet Placed Successfully!",
        description: `You bet ${betAmount} on ${selectedCandidate.name}. Potential winnings: ${(
          Number.parseFloat(betAmount) * selectedCandidate.odds
        ).toFixed(2)}`,
      })

      setIsProcessing(false)
      setOpen(false)
      setBetAmount("")
    }, 1500)
  }

  const handleViewDetails = (candidate) => {
    setViewingCandidate(candidate)
    setDetailsOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {candidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] group"
          >
            <div className="aspect-[3/4] relative">
              <Image
                src={candidate.image || "/placeholder.svg"}
                alt={candidate.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg truncate">{candidate.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <Badge variant="outline" className="bg-gray-100">
                  {candidate.nationality}
                </Badge>
                <span className="text-sm text-gray-500">Age: {candidate.age}</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Odds</span>
                  <span className="font-semibold text-red-700">{candidate.odds.toFixed(2)}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewDetails(candidate)
                  }}
                  className="text-sm text-red-700 hover:text-red-800 mt-2 font-medium"
                >
                  View Details
                </button>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-red-700 hover:bg-red-800" onClick={() => handlePlaceBet(candidate)}>
                Place Bet
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Your Bet</DialogTitle>
            <DialogDescription>
              {selectedCandidate && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-12 w-12 relative rounded-full overflow-hidden">
                    <Image
                      src={selectedCandidate.image || "/placeholder.svg"}
                      alt={selectedCandidate.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedCandidate.name}</p>
                    <p className="text-sm text-gray-500">Odds: {selectedCandidate.odds.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="mpesa" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="mpesa" className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                <span>M-Pesa</span>
              </TabsTrigger>
              <TabsTrigger value="card" className="flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Card</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mpesa">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input id="phone-number" type="tel" placeholder="e.g., 07XX XXX XXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bet-amount-mpesa">Bet Amount (KES)</Label>
                  <Input
                    id="bet-amount-mpesa"
                    type="number"
                    min="100"
                    placeholder="Enter amount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                  />
                </div>

                {betAmount && selectedCandidate && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">Potential Winnings</p>
                    <p className="font-bold text-lg text-green-700">
                      KES {(Number.parseFloat(betAmount) * selectedCandidate.odds).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="card">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" type="text" placeholder="XXXX XXXX XXXX XXXX" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" type="text" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" type="text" placeholder="XXX" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bet-amount-card">Bet Amount</Label>
                  <Input
                    id="bet-amount-card"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                  />
                </div>

                {betAmount && selectedCandidate && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">Potential Winnings</p>
                    <p className="font-bold text-lg text-green-700">
                      {(Number.parseFloat(betAmount) * selectedCandidate.odds).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              className="bg-red-700 hover:bg-red-800"
              onClick={handleConfirmBet}
              disabled={!betAmount || Number.parseFloat(betAmount) <= 0 || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                "Confirm Bet"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CandidateDetails candidate={viewingCandidate} open={detailsOpen} onOpenChange={setDetailsOpen} />
      <Toaster />
    </>
  )
}
