"use client"

import { useState, useEffect } from "react"
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
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface Member {
  id: string
  name: string
}

interface MessageStatus {
  id: string
  recipient: string
  message: string
  sentDate: string
  status: "sent" | "pending" | "failed"
}

const members: Member[] = [
  { id: "M001", name: "John Smith" },
  { id: "M002", name: "Sarah Johnson" },
  { id: "M003", name: "Mike Wilson" },
  { id: "M004", name: "Emily Davis" },
  { id: "M005", name: "Chris Brown" },
  { id: "M006", name: "Jessica Martinez" },
  { id: "M007", name: "David Lee" },
]

interface BulkSmsFormProps {
  initialMemberId?: string
  initialMemberName?: string
}

export function BulkSmsForm({ initialMemberId = "", initialMemberName = "" }: BulkSmsFormProps) {
  const [selectedMember, setSelectedMember] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [messageStatuses, setMessageStatuses] = useState<MessageStatus[]>([
    {
      id: "1",
      recipient: "John Smith, Sarah Johnson, Mike Wilson",
      message: "Hi! Just a reminder that your personal training session is scheduled for tomorrow at 9 AM. Please arrive 10 minutes early.",
      sentDate: "2025/01/17",
      status: "sent",
    },
    {
      id: "2",
      recipient: "All Members",
      message: "🎉 New Year Special! Get 20% off on all membership renewals this month. Don't miss out on this amazing offer!",
      sentDate: "2025/01/15",
      status: "sent",
    },
    {
      id: "3",
      recipient: "Emily Davis",
      message: "Your membership is expiring in 3 days. Renew now to continue enjoying unlimited gym access and exclusive member benefits.",
      sentDate: "2025/01/12",
      status: "sent",
    },
    {
      id: "4",
      recipient: "Active Members",
      message: "Maintenance Notice: The gym will be closed on Sunday, Jan 20th from 6 AM to 12 PM for equipment maintenance. Sorry for any inconvenience.",
      sentDate: "2025/01/10",
      status: "sent",
    },
    {
      id: "5",
      recipient: "Chris Brown, David Lee",
      message: "Congratulations on completing your fitness challenge! Come pick up your certificate and prize at the front desk.",
      sentDate: "2025/01/08",
      status: "sent",
    },
    {
      id: "6",
      recipient: "Jessica Martinez",
      message: "Thank you for your feedback! We've addressed your concerns about the locker room facilities. Please let us know if there's anything else.",
      sentDate: "2025/01/05",
      status: "pending",
    },
    {
      id: "7",
      recipient: "Expired Members",
      message: "We miss you! Come back and enjoy our new fitness classes. Rejoin today and get your first month at 50% off.",
      sentDate: "2025/01/03",
      status: "failed",
    },
  ])

  // Initialize selected member from URL params
  useEffect(() => {
    if (initialMemberId && initialMemberName) {
      setSelectedMember(`${initialMemberName} (${initialMemberId})`)
    }
  }, [initialMemberId, initialMemberName])

  const characterCount = message.length
  const maxCharacters = 160

  // Filter members based on search query
  const filteredMembers = members.filter((member) =>
    member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectMember = (memberId: string, memberName: string) => {
    setSelectedMember(`${memberName} (${memberId})`)
    setSearchQuery("")
    setShowSearchResults(false)
  }

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
    <div className="space-y-6">
      {/* Recipients Section - Full Width */}
      <Card className="p-6 space-y-6">
        {/* Recipients and Advanced Search - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="space-y-3 relative">
            <Label htmlFor="search" className="text-base font-semibold">
              Advance Search
            </Label>
            <Input
              id="search"
              placeholder="Search by member ID or Name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSearchResults(true)
              }}
              onFocus={() => setShowSearchResults(true)}
              className="h-10"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleSelectMember(member.id, member.name)}
                      className="w-full text-left px-4 py-3 transition-colors border-b border-border last:border-b-0"
                    >
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.id}</p>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-muted-foreground text-sm">
                    No members found
                  </div>
                )}
              </div>
            )}
            
            {/* Selected Member Display */}
            {selectedMember && (
              <div className="mt-2">
                <div className="inline-flex items-center gap-2 bg-sidebar-accent px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium">{selectedMember}</span>
                  <button
                    onClick={() => {
                      setSelectedMember("")
                      setSearchQuery("")
                    }}
                    className=""
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Recipients Display - Below */}
        {selectedMember && (
          <div className="pt-2 border-t border-border">
            <Label className="text-sm text-muted-foreground mb-2 block">Selected Recipients</Label>
            <div className="inline-flex items-center gap-2 bg-sidebar-accent px-3 py-2 rounded-lg">
              <span className="text-sm font-medium">{selectedMember}</span>
              <button
                onClick={() => {
                  setSelectedMember("")
                  setSearchQuery("")
                }}
                className="hover:opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

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

      {/* Message Status Section */}
      <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Message Status</h2>
          </div>

          <div className="space-y-3">
            {messageStatuses.length > 0 ? (
              messageStatuses
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((item) => (
                <div key={item.id} className="p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">{item.sentDate}</p>
                    <Badge className={`${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{item.message}</p>
                  <p className="text-xs text-muted-foreground">To: {item.recipient}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No messages sent yet</p>
            )}
          </div>

          {/* Pagination */}
          {messageStatuses.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, messageStatuses.length)} of {messageStatuses.length} messages
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {Math.ceil(messageStatuses.length / itemsPerPage)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(messageStatuses.length / itemsPerPage), prev + 1))}
                  disabled={currentPage >= Math.ceil(messageStatuses.length / itemsPerPage)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
    </div>
  )
}
