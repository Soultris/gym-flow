"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const members = [
  {
    id: "M001",
    name: "John Smith",
    username: "@johnsmith",
    email: "john.smith@email.com",
    phone: "+1 234 567 8900",
    role: "Member",
    package: "Premium",
    visits: "12/25",
    status: "Active",
    enrolled: "May 12, 2024",
    avatar: "JS",
  },
  {
    id: "M002",
    name: "Sarah Johnson",
    username: "@sarahj",
    email: "sarah.j@email.com",
    phone: "+1 234 567 8901",
    role: "Trainer",
    package: "Staff",
    visits: "18/50",
    status: "Active",
    enrolled: "January 7, 2024",
    avatar: "SJ",
  },
  {
    id: "M003",
    name: "Mike Wilson",
    username: "@mikewilson",
    email: "mike.w@email.com",
    phone: "+1 234 567 8902",
    role: "Member",
    package: "Standard",
    visits: "7/25",
    status: "Active",
    enrolled: "March 9, 2024",
    avatar: "MW",
  },
  {
    id: "M004",
    name: "Emily Davis",
    username: "@emilyd",
    email: "emily.d@email.com",
    phone: "+1 234 567 8903",
    role: "Member",
    package: "Basic",
    visits: "0/10",
    status: "Expired",
    enrolled: "November 15, 2023",
    avatar: "ED",
  },
  {
    id: "M005",
    name: "Chris Brown",
    username: "@chrisbrown",
    email: "chris.b@email.com",
    phone: "+1 234 567 8904",
    role: "Trainer",
    package: "Staff",
    visits: "21/50",
    status: "Active",
    enrolled: "February 20, 2024",
    avatar: "CB",
  },
  {
    id: "M006",
    name: "Jessica Martinez",
    username: "@jessicam",
    email: "jessica.m@email.com",
    phone: "+1 234 567 8905",
    role: "Member",
    package: "Premium",
    visits: "15/25",
    status: "Active",
    enrolled: "April 3, 2024",
    avatar: "JM",
  },
  {
    id: "M007",
    name: "David Lee",
    username: "@davidlee",
    email: "david.l@email.com",
    phone: "+1 234 567 8906",
    role: "Member",
    package: "Standard",
    visits: "9/25",
    status: "Active",
    enrolled: "June 18, 2024",
    avatar: "DL",
  },
]

export function MembersList() {
  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
            <th className="w-12 px-4 py-3">
              <Checkbox className="border-[#3a3a3a]" />
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Role</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Package</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Visits</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Enrolled</th>
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr
              key={member.id}
              className={`border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors ${
                index % 2 === 0 ? "bg-[#151515]" : "bg-background"
              }`}
            >
              <td className="px-4 py-4">
                <Checkbox className="border-[#3a3a3a]" />
              </td>
              <td className="px-4 py-4">
                <Link
                  href={`/members/${member.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg?height=36&width=36" />
                    <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.username}</div>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-4">
                <Badge
                  variant="secondary"
                  className={
                    member.role === "Trainer"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-secondary/50 text-muted-foreground border-[#2a2a2a]"
                  }
                >
                  {member.role}
                </Badge>
              </td>
              <td className="px-4 py-4 text-sm">{member.package}</td>
              <td className="px-4 py-4">
                <span className="text-sm">
                  <span className="font-medium">{member.visits.split("/")[0]}</span>
                  <span className="text-muted-foreground">/{member.visits.split("/")[1]}</span>
                </span>
              </td>
              <td className="px-4 py-4">
                <Badge
                  variant="outline"
                  className={
                    member.status === "Active"
                      ? "border-accent text-accent bg-accent/10"
                      : "border-destructive text-destructive bg-destructive/10"
                  }
                >
                  {member.status}
                </Badge>
              </td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{member.enrolled}</td>
              <td className="px-4 py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#2a2a2a]">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Member</DropdownMenuItem>
                    <DropdownMenuItem>Assign Workout</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete Member</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
