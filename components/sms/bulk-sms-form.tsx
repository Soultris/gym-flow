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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, X, Calendar, Clock, Copy, Trash2, Plus } from "lucide-react"

interface Member {
  id: string
  name: string
}

interface SmsTemplate {
  id: string
  name: string
  category: "offers" | "membership" | "announcements" | "reminders" | "events"
  message: string
  createdDate: string
}

interface MessageStatus {
  id: string
  recipient: string
  message: string
  sentDate: string
  scheduledDate?: string
  scheduledTime?: string
  status: "sent" | "pending" | "failed" | "scheduled"
  schedulingType?: "immediate" | "scheduled" | "recurring"
  recurringFrequency?: "daily" | "weekly" | "monthly"
  recurringEndDate?: string
}

interface SchedulingConfig {
  type: "immediate" | "scheduled" | "recurring"
  date?: string
  time?: string
  recurring?: {
    frequency: "daily" | "weekly" | "monthly"
    endDate?: string
  }
}

// Members are now fetched from API
const members = [
  { id: "M001", name: "John Smith" },
  { id: "M002", name: "Sarah Johnson" },
  { id: "M003", name: "Mike Wilson" },
  { id: "M004", name: "Emily Davis" },
  { id: "M005", name: "Chris Brown" },
  { id: "M006", name: "Jessica Martinez" },
  { id: "M007", name: "David Lee" },
]

// Templates are now fetched from API
const smsTemplates: SmsTemplate[] = [
  {
    id: "T001",
    name: "Special Offer - 20% Discount",
    category: "offers",
    message: "🎉 Special Offer! Get 20% off on all membership renewals this month. Don't miss out!",
    createdDate: "2025-01-05",
  },
  {
    id: "T002",
    name: "Membership Expiring Soon",
    category: "membership",
    message: "Your membership is expiring in 3 days. Renew now to continue enjoying unlimited gym access.",
    createdDate: "2025-01-06",
  },
  {
    id: "T003",
    name: "Training Session Reminder",
    category: "reminders",
    message: "Hi! Just a reminder that your personal training session is scheduled for tomorrow at 9 AM.",
    createdDate: "2025-01-01",
  },
]

interface BulkSmsFormProps {
  initialMemberId?: string
  initialMemberName?: string
}

export function BulkSmsForm({ initialMemberId = "", initialMemberName = "" }: BulkSmsFormProps) {
  const [selectedMember, setSelectedMember] = useState(
    initialMemberId && initialMemberName 
      ? `${initialMemberName} (${initialMemberId})` 
      : ""
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [scheduledCurrentPage, setScheduledCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("compose")
  const [templateCategory, setTemplateCategory] = useState<"all" | "offers" | "membership" | "announcements" | "reminders" | "events">("all")
  const [templates, setTemplates] = useState<SmsTemplate[]>(smsTemplates)
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateCategory, setNewTemplateCategory] = useState<"offers" | "membership" | "announcements" | "reminders" | "events">("offers")
  const [newTemplateMessage, setNewTemplateMessage] = useState("")
  const itemsPerPage = 5
  
  // Scheduling states
  const [schedulingType, setSchedulingType] = useState<"immediate" | "scheduled" | "recurring">("immediate")
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("09:00")
  const [recurringFrequency, setRecurringFrequency] = useState<"daily" | "weekly" | "monthly">("daily")
  const [recurringEndDate, setRecurringEndDate] = useState("")
  
  const [messageStatuses, setMessageStatuses] = useState<MessageStatus[]>([
    {
      id: "1",
      recipient: "John Smith, Sarah Johnson, Mike Wilson",
      message: "Hi! Just a reminder that your personal training session is scheduled for tomorrow at 9 AM. Please arrive 10 minutes early.",
      sentDate: "2025/01/17",
      status: "sent",
      schedulingType: "immediate",
    },
    {
      id: "2",
      recipient: "All Members",
      message: "🎉 New Year Special! Get 20% off on all membership renewals this month. Don't miss out on this amazing offer!",
      sentDate: "2025/01/15",
      status: "sent",
      schedulingType: "immediate",
    },
    {
      id: "3",
      recipient: "Emily Davis",
      message: "Your membership is expiring in 3 days. Renew now to continue enjoying unlimited gym access and exclusive member benefits.",
      sentDate: "2025/01/12",
      status: "sent",
      schedulingType: "immediate",
    },
    {
      id: "4",
      recipient: "Active Members",
      message: "Maintenance Notice: The gym will be closed on Sunday, Jan 20th from 6 AM to 12 PM for equipment maintenance. Sorry for any inconvenience.",
      sentDate: "2025/01/10",
      status: "sent",
      schedulingType: "immediate",
    },
    {
      id: "5",
      recipient: "Chris Brown, David Lee",
      message: "Congratulations on completing your fitness challenge! Come pick up your certificate and prize at the front desk.",
      sentDate: "2025/01/08",
      status: "sent",
      schedulingType: "immediate",
    },
    {
      id: "6",
      recipient: "Jessica Martinez",
      message: "Thank you for your feedback! We've addressed your concerns about the locker room facilities. Please let us know if there's anything else.",
      sentDate: "2025/01/05",
      status: "pending",
      schedulingType: "immediate",
    },
    {
      id: "7",
      recipient: "Expired Members",
      message: "We miss you! Come back and enjoy our new fitness classes. Rejoin today and get your first month at 50% off.",
      sentDate: "2025/01/03",
      status: "failed",
      schedulingType: "immediate",
    },
    {
      id: "8",
      recipient: "All Members",
      message: "Weekly fitness tip: Remember to stay hydrated during your workouts!",
      sentDate: "2025/01/06",
      scheduledDate: "2025/01/20",
      scheduledTime: "09:00",
      status: "scheduled",
      schedulingType: "recurring",
      recurringFrequency: "weekly",
    },
    {
      id: "9",
      recipient: "Active Members",
      message: "Monthly reminder: Your membership renewal is coming up next week. Renew early for a discount!",
      sentDate: "2025/01/06",
      scheduledDate: "2025/01/25",
      scheduledTime: "10:00",
      status: "scheduled",
      schedulingType: "scheduled",
    },
  ])


  const characterCount = message.length
  const maxCharacters = 160

  // Filter members based on search query
  const filteredMembers = members.filter((member) =>
    member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter templates based on category
  const filteredTemplates = templateCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === templateCategory)

  const handleSelectMember = (memberId: string, memberName: string) => {
    setSelectedMember(`${memberName} (${memberId})`)
    setSearchQuery("")
    setShowSearchResults(false)
  }

  const handleUseTemplate = (templateMessage: string) => {
    setMessage(templateMessage)
    setActiveTab("compose")
  }

  const handleSaveNewTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateMessage.trim()) {
      alert("Please fill in all template fields")
      return
    }

    const newTemplate: SmsTemplate = {
      id: `T${Date.now()}`,
      name: newTemplateName,
      category: newTemplateCategory,
      message: newTemplateMessage,
      createdDate: new Date().toISOString().split("T")[0],
    }

    setTemplates([...templates, newTemplate])
    setNewTemplateName("")
    setNewTemplateMessage("")
    setShowNewTemplateForm(false)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter(t => t.id !== templateId))
    }
  }

  const handleSendSms = () => {
    if (!selectedMember || !message.trim()) {
      alert("Please select a member and enter a message")
      return
    }

    // Validate scheduling
    if (schedulingType === "scheduled" && !scheduleDate) {
      alert("Please select a date for scheduled SMS")
      return
    }

    if (schedulingType === "recurring" && !scheduleDate) {
      alert("Please select a start date for recurring SMS")
      return
    }

    // Add new message to status
    const newMessage: MessageStatus = {
      id: (messageStatuses.length + 1).toString(),
      recipient: selectedMember,
      message: message,
      sentDate: new Date().toLocaleDateString("en-CA"),
      scheduledDate: (schedulingType !== "immediate") ? scheduleDate : undefined,
      scheduledTime: (schedulingType !== "immediate") ? scheduleTime : undefined,
      status: schedulingType === "immediate" ? "sent" : "scheduled",
      schedulingType: schedulingType,
      recurringFrequency: schedulingType === "recurring" ? recurringFrequency : undefined,
      recurringEndDate: schedulingType === "recurring" ? recurringEndDate : undefined,
    }

    setMessageStatuses([newMessage, ...messageStatuses])
    setMessage("")
    setSelectedMember("")
    setSchedulingType("immediate")
    setScheduleDate("")
    setScheduleTime("09:00")
    setRecurringFrequency("daily")
    setRecurringEndDate("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-[#00FF9D]/10 text-[#00FF9D]"
      case "pending":
        return "bg-[#E8FF00]/10 text-[#E8FF00]"
      case "failed":
        return "bg-[#EF4444]/10 text-[#EF4444]"
      case "scheduled":
        return "bg-[#00B4FF]/10 text-[#00B4FF]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-[#2a2a2a] rounded-none h-auto p-0 gap-6 inline-flex mb-6">
            <TabsTrigger 
              value="compose"
              className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1 pb-3 pt-0 text-muted-foreground data-[state=active]:text-foreground"
            >
              Compose Message
            </TabsTrigger>
            <TabsTrigger 
              value="templates"
              className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1 pb-3 pt-0 text-muted-foreground data-[state=active]:text-foreground"
            >
              SMS Templates
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1 pb-3 pt-0 text-muted-foreground data-[state=active]:text-foreground"
            >
              Message History
            </TabsTrigger>
            <TabsTrigger 
              value="scheduled"
              className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1 pb-3 pt-0 text-muted-foreground data-[state=active]:text-foreground"
            >
              Scheduled Messages
            </TabsTrigger>
          </TabsList>

          {/* Compose Message Tab */}
          <TabsContent value="compose" className="mt-6 space-y-6">
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

        {/* Scheduling Section */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <h3 className="text-base font-semibold mb-4">Schedule Message</h3>
            
            {/* Scheduling Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setSchedulingType("immediate")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  schedulingType === "immediate"
                    ? "border-[#E8FF00] bg-[#E8FF00]/10"
                    : "border-border bg-background hover:bg-card"
                }`}
              >
                <p className="font-semibold text-sm">Send Now</p>
                <p className="text-xs text-muted-foreground mt-1">Immediate delivery</p>
              </button>

              <button
                onClick={() => setSchedulingType("scheduled")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  schedulingType === "scheduled"
                    ? "border-[#E8FF00] bg-[#E8FF00]/10"
                    : "border-border bg-background hover:bg-card"
                }`}
              >
              <p className="font-semibold text-sm flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Once
                </p>
                <p className="text-xs text-muted-foreground mt-1">Send at specific time</p>
              </button>

              <button
                onClick={() => setSchedulingType("recurring")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  schedulingType === "recurring"
                    ? "border-[#E8FF00] bg-[#E8FF00]/10"
                    : "border-border bg-background hover:bg-card"
                }`}
              >
                <p className="font-semibold text-sm">Recurring</p>
                <p className="text-xs text-muted-foreground mt-1">Repeat on schedule</p>
              </button>
            </div>

            {/* Scheduled/Recurring Options */}
            {schedulingType !== "immediate" && (
              <div className="bg-card p-5 rounded-lg border border-border space-y-4">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label htmlFor="schedule-date" className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {schedulingType === "scheduled" ? "Send Date" : "Start Date"}
                  </Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={getMinDate()}
                    className="h-10"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="schedule-time" className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Send Time
                  </Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Recurring Options */}
                {schedulingType === "recurring" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="frequency" className="text-sm font-semibold">
                        Repeat Frequency
                      </Label>
                      <Select value={recurringFrequency} onValueChange={(value: "daily" | "weekly" | "monthly") => setRecurringFrequency(value)}>
                        <SelectTrigger id="frequency" className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recurrence-end-date" className="text-sm font-semibold">
                        End Date (Optional)
                      </Label>
                      <Input
                        id="recurrence-end-date"
                        type="date"
                        value={recurringEndDate}
                        onChange={(e) => setRecurringEndDate(e.target.value)}
                        min={scheduleDate}
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">Leave empty for continuous recurring</p>
                    </div>
                  </>
                )}

                {/* Schedule Preview */}
                {scheduleDate && (
                  <div className="bg-background rounded p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                    <p className="text-sm font-medium">
                      {schedulingType === "scheduled" 
                        ? `Send on ${new Date(scheduleDate).toLocaleDateString()} at ${scheduleTime}`
                        : `Starting ${new Date(scheduleDate).toLocaleDateString()} at ${scheduleTime}, repeating ${recurringFrequency}${recurringEndDate ? ` until ${new Date(recurringEndDate).toLocaleDateString()}` : ""}`
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Send SMS Button */}
        <Button
          onClick={handleSendSms}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {schedulingType === "immediate" ? "Send SMS Now" : "Schedule SMS"}
        </Button>
          </TabsContent>

          {/* SMS Templates Tab */}
          <TabsContent value="templates" className="mt-6 space-y-6">
            <div className="space-y-4">
              {/* Create New Template Button */}
              {!showNewTemplateForm && (
                <Button 
                  onClick={() => setShowNewTemplateForm(true)}
                  className="gap-2 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
                >
                  <Plus className="h-4 w-4" />
                  Create New Template
                </Button>
              )}

              {/* New Template Form */}
              {showNewTemplateForm && (
                <Card className="p-4 bg-card border-[#E8FF00]/50">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Create SMS Template</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="template-name" className="text-sm mb-2 block">Template Name</Label>
                        <Input 
                          id="template-name"
                          placeholder="e.g., New Year Offer"
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-category" className="text-sm mb-2 block">Category</Label>
                        <Select value={newTemplateCategory} onValueChange={(value: "offers" | "membership" | "announcements" | "reminders" | "events") => setNewTemplateCategory(value)}>
                          <SelectTrigger id="template-category" className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="offers">Offers</SelectItem>
                            <SelectItem value="membership">Membership</SelectItem>
                            <SelectItem value="announcements">Announcements</SelectItem>
                            <SelectItem value="reminders">Reminders</SelectItem>
                            <SelectItem value="events">Events</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="template-message" className="text-sm mb-2 block">Message</Label>
                      <Textarea 
                        id="template-message"
                        placeholder="Enter your template message..."
                        value={newTemplateMessage}
                        onChange={(e) => setNewTemplateMessage(e.target.value.slice(0, maxCharacters))}
                        className="min-h-24 resize-none"
                      />
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {newTemplateMessage.length}/{maxCharacters} characters
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveNewTemplate}
                        size="sm"
                        className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
                      >
                        Save Template
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowNewTemplateForm(false)
                          setNewTemplateName("")
                          setNewTemplateMessage("")
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Category Filter */}
              <div>
                <Label className="text-sm mb-2 block">Filter by Category</Label>
                <div className="flex flex-wrap gap-2">
                  {["all", "offers", "membership", "announcements", "reminders", "events"].map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={templateCategory === cat ? "default" : "outline"}
                      onClick={() => setTemplateCategory(cat as any)}
                      className={templateCategory === cat ? "bg-[#E8FF00] text-black hover:bg-[#E8FF00]/80" : ""}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Templates List */}
              <div className="grid gap-3 mt-4">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <Card key={template.id} className="p-4 bg-background border-[#2a2a2a] hover:border-[#E8FF00]/50 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{template.name}</h4>
                            <div className="text-xs text-muted-foreground mt-1">
                              Category: <Badge variant="outline" className="text-xs ml-1">
                                {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Created: {template.createdDate}</p>
                        </div>

                        <p className="text-sm text-muted-foreground">{template.message}</p>

                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleUseTemplate(template.message)}
                            className="gap-2 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
                          >
                            <Copy className="h-3 w-3" />
                            Use Template
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-destructive hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No templates found in this category</p>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <div className="space-y-3">
              {messageStatuses.filter(item => item.status !== "scheduled").length > 0 ? (
                messageStatuses
                  .filter(item => item.status !== "scheduled")
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item) => (
                  <div key={item.id} className="p-4 bg-background rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground">{item.sentDate}</p>
                      </div>
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

            {/* Pagination for History */}
            {messageStatuses.filter(item => item.status !== "scheduled").length > itemsPerPage && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, messageStatuses.filter(item => item.status !== "scheduled").length)} of {messageStatuses.filter(item => item.status !== "scheduled").length} messages
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
                    Page {currentPage} of {Math.ceil(messageStatuses.filter(item => item.status !== "scheduled").length / itemsPerPage)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(messageStatuses.filter(item => item.status !== "scheduled").length / itemsPerPage), prev + 1))}
                    disabled={currentPage >= Math.ceil(messageStatuses.filter(item => item.status !== "scheduled").length / itemsPerPage)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Scheduled Messages Tab */}
          <TabsContent value="scheduled" className="mt-0">
            <div className="space-y-3">
              {messageStatuses.filter(item => item.status === "scheduled").length > 0 ? (
                messageStatuses
                  .filter(item => item.status === "scheduled")
                  .slice((scheduledCurrentPage - 1) * itemsPerPage, scheduledCurrentPage * itemsPerPage)
                  .map((item) => (
                  <div key={item.id} className="p-4 bg-background rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground">
                          Scheduled: {item.scheduledDate} at {item.scheduledTime}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            className={item.schedulingType === "recurring" 
                              ? "bg-purple-500/10 text-purple-400" 
                              : "bg-[#00B4FF]/10 text-[#00B4FF]"}
                          >
                            {item.schedulingType === "recurring" ? "Recurring" : "Scheduled"}
                          </Badge>
                          {item.schedulingType === "recurring" && item.recurringFrequency && (
                            <Badge variant="outline" className="text-xs">
                              {item.recurringFrequency.charAt(0).toUpperCase() + item.recurringFrequency.slice(1)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {/* Cancel Actions */}
                      <div className="flex items-center gap-2">
                        {item.schedulingType === "scheduled" && (
                          <button
                            onClick={() => {
                              setMessageStatuses(prev => prev.filter(msg => msg.id !== item.id))
                            }}
                            className="text-xs text-red-500 hover:text-red-400 hover:underline transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        {item.schedulingType === "recurring" && (
                          <>
                            <button
                              onClick={() => {
                                // For recurring: Cancel just the next occurrence (simulate by pushing date forward)
                                const frequency = item.recurringFrequency
                                const currentDate = new Date(item.scheduledDate || "")
                                const nextDate = new Date(currentDate)
                                
                                if (frequency === "daily") {
                                  nextDate.setDate(nextDate.getDate() + 1)
                                } else if (frequency === "weekly") {
                                  nextDate.setDate(nextDate.getDate() + 7)
                                } else if (frequency === "monthly") {
                                  nextDate.setMonth(nextDate.getMonth() + 1)
                                }
                                
                                setMessageStatuses(prev => prev.map(msg => 
                                  msg.id === item.id 
                                    ? { ...msg, scheduledDate: nextDate.toISOString().split("T")[0] }
                                    : msg
                                ))
                              }}
                              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
                            >
                              Skip Next
                            </button>
                            <span className="text-muted-foreground">|</span>
                            <button
                              onClick={() => {
                                setMessageStatuses(prev => prev.filter(msg => msg.id !== item.id))
                              }}
                              className="text-xs text-red-500 hover:text-red-400 hover:underline transition-colors"
                            >
                              Cancel All
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm mb-2">{item.message}</p>
                    <p className="text-xs text-muted-foreground">To: {item.recipient}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No scheduled messages</p>
              )}
            </div>

            {/* Pagination for Scheduled */}
            {messageStatuses.filter(item => item.status === "scheduled").length > itemsPerPage && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {((scheduledCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(scheduledCurrentPage * itemsPerPage, messageStatuses.filter(item => item.status === "scheduled").length)} of {messageStatuses.filter(item => item.status === "scheduled").length} messages
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScheduledCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={scheduledCurrentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Page {scheduledCurrentPage} of {Math.ceil(messageStatuses.filter(item => item.status === "scheduled").length / itemsPerPage)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScheduledCurrentPage(prev => Math.min(Math.ceil(messageStatuses.filter(item => item.status === "scheduled").length / itemsPerPage), prev + 1))}
                    disabled={scheduledCurrentPage >= Math.ceil(messageStatuses.filter(item => item.status === "scheduled").length / itemsPerPage)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
