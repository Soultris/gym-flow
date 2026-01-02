import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Users, TrendingUp } from "lucide-react"

const reports = [
  {
    title: "Daily Income",
    description: "Today's revenue summary",
    value: "$1,450",
    icon: TrendingUp,
  },
  {
    title: "Total Attendance",
    description: "Members checked in today",
    value: "127",
    icon: Users,
  },
  {
    title: "Active Members",
    description: "Current active memberships",
    value: "342",
    icon: FileText,
  },
]

export function ReportCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {reports.map((report) => (
        <Card key={report.title} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <report.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{report.description}</p>
                <p className="text-2xl font-bold mt-1">{report.value}</p>
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full mt-4 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </Card>
      ))}
    </div>
  )
}
