"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, Calendar, MapPin, User, CreditCard, Clock } from "lucide-react"

const attendanceHistory = [
  { date: "Jun 23, 2024", time: "06:30 AM", duration: "1.5 hrs" },
  { date: "Jun 21, 2024", time: "06:15 AM", duration: "1.2 hrs" },
  { date: "Jun 19, 2024", time: "07:00 AM", duration: "1.8 hrs" },
  { date: "Jun 17, 2024", time: "06:45 AM", duration: "1.3 hrs" },
  { date: "Jun 15, 2024", time: "06:30 AM", duration: "1.5 hrs" },
]

const paymentHistory = [
  { date: "Jun 1, 2024", amount: "$80", method: "Card", status: "Paid" },
  { date: "May 1, 2024", amount: "$80", method: "Card", status: "Paid" },
  { date: "Apr 1, 2024", amount: "$80", method: "Cash", status: "Paid" },
  { date: "Mar 1, 2024", amount: "$80", method: "Card", status: "Paid" },
]

export function MemberProfile({ memberId }: { memberId: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="bg-secondary text-foreground text-2xl font-bold">JS</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mt-4">John Smith</h2>
            <p className="text-sm text-muted-foreground">ID: {memberId}</p>
            <Badge variant="outline" className="border-accent text-accent mt-2">
              Active
            </Badge>
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>john.smith@email.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+1 234 567 8900</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Born: Jan 15, 1990</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Male</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>123 Main St, City, ST 12345</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Edit Profile</Button>
            <Button variant="outline" className="w-full bg-transparent">
              Send SMS
            </Button>
            <Button variant="outline" className="w-full text-destructive hover:text-destructive bg-transparent">
              Deactivate
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="p-6">
          <Tabs defaultValue="membership" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="membership" className="space-y-4 mt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Package</p>
                  <p className="text-lg font-semibold text-primary">Premium</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Monthly Fee</p>
                  <p className="text-lg font-semibold">$80.00</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="text-lg font-semibold">Jan 15, 2024</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="text-lg font-semibold">Jul 15, 2024</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold">6 Months</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Days Remaining</p>
                  <p className="text-lg font-semibold text-accent">22 Days</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold mb-3">Assigned Workout Plan</h3>
                <Card className="p-4 bg-secondary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Strength Training Program</p>
                      <p className="text-sm text-muted-foreground">4 days/week • 60 min sessions</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4 mt-6">
              <div className="space-y-3">
                {attendanceHistory.map((record, i) => (
                  <Card key={i} className="p-4 bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-accent/10 p-2">
                          <Clock className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{record.date}</p>
                          <p className="text-sm text-muted-foreground">Check-in: {record.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-primary text-primary">
                        {record.duration}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4 mt-6">
              <div className="space-y-3">
                {paymentHistory.map((payment, i) => (
                  <Card key={i} className="p-4 bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.date} • {payment.method}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-accent text-accent">
                        {payment.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
