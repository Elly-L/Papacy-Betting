"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Globe, Award, BookOpen, Users, ArrowLeft } from "lucide-react"

// Candidate detailed information sourced from BBC and similar sources
const candidateDetails = {
  "Pietro Parolin": {
    bio: "Cardinal Pietro Parolin is the Vatican Secretary of State, effectively the Pope's prime minister. He's known for his diplomatic skills and has been instrumental in improving relations between the Vatican and China.",
    achievements:
      "Negotiated historic agreement with China on bishop appointments, improved Vatican's international relations, and modernized Vatican financial systems.",
    ideology:
      "Considered a moderate who balances traditional Catholic values with diplomatic pragmatism. He supports dialogue with other religions and engagement with modern social issues.",
    support:
      "Strong support from European cardinals and those favoring diplomatic engagement. Has connections throughout the Vatican bureaucracy.",
  },
  "Luis Antonio Gokim Tagle": {
    bio: "Cardinal Luis Antonio Tagle from the Philippines is the Prefect of the Congregation for the Evangelization of Peoples. Known for his charismatic communication style and pastoral approach, he's often called the 'Asian Francis'.",
    achievements:
      "Led significant growth of the Church in Asia, pioneered digital evangelization efforts, and championed humanitarian causes through Caritas Internationalis.",
    ideology:
      "Progressive on social justice issues while maintaining traditional positions on doctrine. Emphasizes mercy and compassion in Church teaching.",
    support:
      "Popular among Asian and developing world cardinals. Has strong support from those wanting the Church to focus more on the Global South.",
  },
  "Fridolin Ambongo Besungu": {
    bio: "Cardinal Fridolin Ambongo from the Democratic Republic of Congo is the Archbishop of Kinshasa. He's known for his outspoken advocacy for social justice and human rights in Africa.",
    achievements:
      "Stood up against political corruption in DRC, advocated for environmental protection in the Congo Basin, and strengthened Catholic education across Africa.",
    ideology:
      "Combines traditional African Catholic values with progressive stance on social justice. Emphasizes the Church's role in addressing poverty and political oppression.",
    support:
      "Strong backing from African cardinals and those who believe the next Pope should come from the growing African Church.",
  },
  "Peter Kodwo Appiah Turkson": {
    bio: "Cardinal Peter Turkson from Ghana is the Chancellor of the Pontifical Academies of Sciences and Social Sciences. He was the first head of the Dicastery for Promoting Integral Human Development.",
    achievements:
      "Led Vatican's work on environmental issues including the development of Laudato Si', advanced Catholic social teaching on economics, and promoted interfaith dialogue.",
    ideology:
      "Balances traditional moral teachings with progressive views on economic justice and environmental protection. Known for practical approach to implementing Church teaching.",
    support:
      "Respected among both conservative and progressive cardinals. Has support from African Church and those focused on environmental and social justice issues.",
  },
  "Peter Erdo": {
    bio: "Cardinal Péter Erdő from Hungary is the Archbishop of Esztergom-Budapest and former president of the Council of European Bishops' Conferences. He's known for his intellectual rigor as a canon lawyer.",
    achievements:
      "Preserved Church strength in post-communist Hungary, organized International Eucharistic Congress in Budapest, and contributed significantly to canon law development.",
    ideology:
      "Considered a conservative who emphasizes doctrinal clarity and traditional Catholic teaching while engaging with modern European challenges.",
    support:
      "Strong backing from Eastern European cardinals and traditionalists who value doctrinal precision and intellectual leadership.",
  },
  "Angelo Scola": {
    bio: "Cardinal Angelo Scola from Italy is the Archbishop Emeritus of Milan. He was previously Patriarch of Venice and is known for his theological depth and intellectual contributions.",
    achievements:
      "Founded the Studium Generale Marcianum academic institute, led the Archdiocese of Milan through significant reforms, and contributed to Catholic-Muslim dialogue.",
    ideology:
      "Theologically conservative while open to dialogue with modern culture. Emphasizes the importance of family and Catholic identity in secularized societies.",
    support:
      "Has support among Italian cardinals and those valuing theological depth. Was considered papabile in the 2013 conclave.",
  },
  "Reinhard Marx": {
    bio: "Cardinal Reinhard Marx from Germany is the Archbishop of Munich and Freising and former president of the German Bishops' Conference. He's known for his outspoken views on Church reform.",
    achievements:
      "Led significant financial reforms as coordinator of the Vatican's Council for the Economy, championed dialogue on controversial issues in the German Church, and advanced Catholic social teaching.",
    ideology:
      "Progressive on Church governance and pastoral approaches while maintaining core Catholic teaching. Advocates for decentralization and greater lay involvement.",
    support:
      "Strong backing from German-speaking and Western European cardinals who favor structural reforms in the Church.",
  },
  "Robert Prevost": {
    bio: "Cardinal Robert Prevost from the United States is the Prefect of the Dicastery for Bishops. Previously served as Bishop of Chiclayo, Peru, and as Prior General of the Augustinian Order.",
    achievements:
      "Strengthened the process of selecting bishops worldwide, served as a missionary bishop in Peru, and led the Augustinian Order through significant reforms.",
    ideology:
      "Balances American pragmatism with Latin American pastoral sensitivity. Emphasizes the importance of selecting bishops who are close to their people.",
    support:
      "Has connections across both North and South American Church leadership. Respected for his experience in both the developed and developing world.",
  },
  "Pierbattista Pizzaballa": {
    bio: "Cardinal Pierbattista Pizzaballa from Italy is the Latin Patriarch of Jerusalem. He has extensive experience in the Holy Land and is known for his diplomatic skills in a complex region.",
    achievements:
      "Navigated the Church through conflicts in the Holy Land, improved Catholic-Jewish relations, and maintained Christian presence in challenging circumstances.",
    ideology:
      "Practical and diplomatic, focusing on concrete solutions rather than ideological positions. Emphasizes the Church's role as peacemaker.",
    support:
      "Respected for his work in the Holy Land. Has support from those who value experience in interfaith dialogue and conflict resolution.",
  },
  "Michael Czerny": {
    bio: "Cardinal Michael Czerny from Canada is the Prefect of the Dicastery for Promoting Integral Human Development. Known for his work with refugees and migrants and social justice advocacy.",
    achievements:
      "Led Vatican's response to the global migration crisis, advanced the Church's environmental teaching, and worked extensively with marginalized communities worldwide.",
    ideology:
      "Progressive on social justice issues while maintaining Catholic teaching. Emphasizes the preferential option for the poor and care for creation.",
    support:
      "Popular among cardinals focused on social justice issues and those who want to continue Pope Francis's emphasis on mercy and outreach to the margins.",
  },
}

export function CandidateDetails({ candidate, open, onOpenChange }) {
  if (!candidate) return null

  const details = candidateDetails[candidate.name] || {
    bio: "Information not available",
    achievements: "Information not available",
    ideology: "Information not available",
    support: "Information not available",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-2xl">{candidate.name}</DialogTitle>
          </div>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-gray-100">
              {candidate.nationality}
            </Badge>
            <span className="text-sm">Age: {candidate.age}</span>
            <span className="text-sm font-medium text-red-700">Odds: {candidate.odds.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div className="md:col-span-1">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
              <Image src={candidate.image || "/placeholder.svg"} alt={candidate.name} fill className="object-cover" />
            </div>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="bio" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="bio" className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Biography</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Achievements</span>
                </TabsTrigger>
                <TabsTrigger value="ideology" className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Ideology</span>
                </TabsTrigger>
                <TabsTrigger value="support" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Support</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bio">
                <Card>
                  <CardContent className="pt-6">
                    <p>{details.bio}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card>
                  <CardContent className="pt-6">
                    <p>{details.achievements}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ideology">
                <Card>
                  <CardContent className="pt-6">
                    <p>{details.ideology}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support">
                <Card>
                  <CardContent className="pt-6">
                    <p>{details.support}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 bg-white pt-2">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
