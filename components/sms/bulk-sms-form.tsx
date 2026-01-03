"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

interface MessageStatus {
  id: string
  recipient: string
  message: string
  sentDate: string
  status: "sent" | "pending" | "failed"
}

export function BulkSmsForm() {
  const [selectedMember, setSelectedMember] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [messageStatuses, setMessageStatuses] = useState<MessageStatus[]>([
    {
      id: "1",
      recipient: "All Members",
      message: "Christmas offers",
      sentDate: "2025/01/01",
      status: "sent",
    },
    {
      id: "2",
      recipient: "All Members",
      message: "Christmas offers",
      sentDate: "2025/01/02",
      status: "sent",
    },
    {
      id: "3",
      recipient: "All Members",
      message: "Christmas offers",
      sentDate: "2025/01/03",
      status: "sent",
    },
    {
      id: "4",
      recipient: "All Members",
      message: "Christmas offers",
      sentDate: "2025/01/17",
      status: "sent",
    },
  ])

  const characterCount = message.length
  const maxCharacters = 160

  const handleSendSms = () => {
    if (!selectedMember || !message.trim()) {
      alert("Please select a member and enter a message")
      return
    }

    // Add new message to status
    const newMessage: MessageStatus = {
      id: (messageStatuses.length + 1).toString(),
      recipient: selectedMember,
      message: message,
      sentDate: new Date().toLocaleDateString("en-CA"),
      status: "sent",
    }

    setMessageStatuses([newMessage, ...messageStatuses])
    setMessage("")
    setSelectedMember("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-[#00FF9D]/10 text-[#00FF9D]"
      case "pending":
        return "bg-[#E8FF00]/10 text-[#E8FF00]"
      case "failed":
        return "bg-[#EF4444]/10 text-[#EF4444]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Section */}
      <div className="lg:col-span-2">
        <Card className="p-6 space-y-6">
          {/* Select Recipients */}
          <div className="space-y-3">
            <Label htmlFor="select-member" className="text-base font-semibold">
              Select Recipients
            </Label>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger id="select-member" className="h-10">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-members">All Members</SelectItem>
                <SelectItem value="active-members">Active Members</SelectItem>
                <SelectItem value="expired-members">Expired Members</SelectItem>
                <SelectItem value="male-members">Male Members</SelectItem>
                <SelectItem value="female-members">Female Members</SelectItem>
                <SelectItem value="trainers">Trainers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advance Search */}
          <div className="space-y-3">
            <Label htmlFor="search" className="text-base font-semibold">
              Advance Search
            </Label>
            <Input
              id="search"
              placeholder="Search by member ID or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <Label htmlFor="message" className="text-base font-semibold">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxCharacters))}
              className="min-h-40 resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              Maximum {maxCharacters} characters per SMS ({characterCount}/{maxCharacters})
            </p>
          </div>

          {/* Send SMS Button */}
          <Button
            onClick={handleSendSms}
            className="w-full h-11 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/50 text-base"
          >
            Send SMS
          </Button>
        </Card>
      </div>

      {/* Message Status Section */}
      <div className="lg:col-span-3">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Message Status</h2>
            <button className="text-sm font-medium text-[#E8FF00] hover:text-[#E8FF00]/50 flex items-center gap-1">
              View all
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {messageStatuses.length > 0 ? (
              messageStatuses.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-4 bg-background rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {item.recipient} <span className="text-muted-foreground">- {item.message}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{item.sentDate}</p>
                  </div>
                  <Badge className={`ml-2 ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No messages sent yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
