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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, X, Calendar, Clock, Copy, Trash2, Plus, RefreshCw } from "lucide-react"
import {
  useGetMessageTemplatesQuery,
  useCreateMessageTemplateMutation,
  useDeleteMessageTemplateMutation,
  useCreateBulkMessageMutation,
  useGetMessageHistoryQuery,
  useGetScheduledMessagesQuery,
  useCancelBulkMessageMutation,
} from "@/store/api/messagesApi"
import { useGetMembersQuery } from "@/store/api/membersApi"
import { toast } from "react-hot-toast"

interface BulkSmsFormProps {
  initialMemberId?: string
  initialMemberName?: string
}

export function BulkSmsForm({ initialMemberId = "", initialMemberName = "" }: BulkSmsFormProps) {
  // --- Global State & Mutations ---
  const { data: membersData } = useGetMembersQuery({ limit: 1000 }) // Fetch all members for client-side filtering for now
  const { data: templatesData, refetch: refetchTemplates } = useGetMessageTemplatesQuery()
  const { data: historyData, refetch: refetchHistory } = useGetMessageHistoryQuery()
  const { data: scheduledData, refetch: refetchScheduled } = useGetScheduledMessagesQuery()

  const [createTemplate] = useCreateMessageTemplateMutation()
  const [deleteTemplate] = useDeleteMessageTemplateMutation()
  const [createBulkMessage] = useCreateBulkMessageMutation()
  const [cancelBulkMessage] = useCancelBulkMessageMutation()

  // --- Local State ---
  const [selectedRecipientType, setSelectedRecipientType] = useState<string>("")
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([])
  const [selectedMemberName, setSelectedMemberName] = useState(
    initialMemberId && initialMemberName 
      ? `${initialMemberName} (${initialMemberId})` 
      : ""
  )
  
  // Initialize initial member selection
  useEffect(() => {
    if (initialMemberId) {
      setSelectedMemberIds([parseInt(initialMemberId)])
    }
  }, [initialMemberId])

  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [scheduledCurrentPage, setScheduledCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("compose")
  const [templateCategory, setTemplateCategory] = useState<string>("all")
  
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateCategory, setNewTemplateCategory] = useState<"offers" | "member_alerts" | "announcements">("offers")
  const [newTemplateMessage, setNewTemplateMessage] = useState("")
  
  const itemsPerPage = 5
  
  // Scheduling states
  const [schedulingType, setSchedulingType] = useState<"once" | "weekly" | "monthly" | "yearly" | "immediate">("immediate")
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("09:00")
  const [recurringFrequency, setRecurringFrequency] = useState<number>(1)
  const [recurringEndDate, setRecurringEndDate] = useState("")

  const members = membersData?.members || []
  const templates = templatesData || []
  const historyMessages = historyData || []
  const scheduledMessages = scheduledData || []

  const characterCount = message.length
  const maxCharacters = 160

  // Filter members based on search query
  const filteredMembers = members.filter((member) =>
    member.memberId.toString().includes(searchQuery) ||
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter templates based on category
  const filteredTemplates = templateCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === templateCategory)

  const handleSelectMember = (memberId: number, memberName: string) => {
    setSelectedMemberName(`${memberName} (${memberId})`)
    setSelectedMemberIds([memberId])
    setSelectedRecipientType("individual")
    setSearchQuery("")
    setShowSearchResults(false)
  }

  const handleSelectRecipientType = (type: string) => {
    setSelectedRecipientType(type)
    // Clear individual selection if group is selected
    if (type !== "individual") {
      setSelectedMemberName(`${type.replace("-", " ").toUpperCase()}`)
      // Logic to filtering IDs based on group would go here, 
      // but for now the backend handles specific logic if we implement group messaging properly.
      // Since the backend expects `memberIds`, we need to resolve these IDs on frontend 
      // OR update backend to accept filters.
      // For this implementation, I will filter IDs on frontend.
      
      let ids: number[] = []
      if (type === "all-members") ids = members.map(m => m.memberId)
      else if (type === "active-members") ids = members.filter(m => m.status === 'active').map(m => m.memberId)
      else if (type === "expired-members") ids = members.filter(m => m.status === 'expired').map(m => m.memberId)
      else if (type === "male-members") ids = members.filter(m => m.gender === 'male').map(m => m.memberId)
      else if (type === "female-members") ids = members.filter(m => m.gender === 'female').map(m => m.memberId)
      
      setSelectedMemberIds(ids)
    }
  }

  const handleUseTemplate = (templateMessage: string) => {
    setMessage(templateMessage)
    setActiveTab("compose")
  }

  const handleSaveNewTemplate = async () => {
    if (!newTemplateName.trim() || !newTemplateMessage.trim()) {
      toast.error("Please fill in all template fields")
      return
    }

    try {
      await createTemplate({
        name: newTemplateName,
        category: newTemplateCategory,
        message: newTemplateMessage,
      }).unwrap()
      
      setNewTemplateName("")
      setNewTemplateMessage("")
      setShowNewTemplateForm(false)
      refetchTemplates()
      toast.success("Template created successfully")
    } catch (error) {
      console.error("Failed to create template", error)
      toast.error("Failed to create template")
    }
  }

  const handleDeleteTemplate = async (templateId: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteTemplate(templateId).unwrap()
        refetchTemplates()
        toast.success("Template deleted successfully")
      } catch (error) {
        console.error("Failed to delete template", error)
        toast.error("Failed to delete template")
      }
    }
  }

  const handleSendSms = async () => {
    if (selectedMemberIds.length === 0 || !message.trim()) {
      toast.error("Please select recipients and enter a message")
      return
    }

    // Validate scheduling
    if (schedulingType !== "immediate" && !scheduleDate) {
      toast.error("Please select a date for scheduled SMS")
      return
    }

    try {
      const payload: any = {
        message,
        memberIds: selectedMemberIds,
        schedulingType: schedulingType === "immediate" ? "once" : schedulingType,
      }

      if (schedulingType !== "immediate") {
        const dateTime = new Date(`${scheduleDate}T${scheduleTime}`)
        payload.scheduledTime = dateTime.toISOString()
        
        if (schedulingType !== "once") {
           payload.recurringTime = dateTime.toISOString() // Start recurring from this time
           payload.startDate = dateTime.toISOString()
           if (recurringEndDate) {
             payload.endDate = new Date(recurringEndDate).toISOString()
           }
           payload.recurringFrequency = recurringFrequency
           // basic mapping for day of week/month could be added here
        }
      }

      await createBulkMessage(payload).unwrap()
      
      setMessage("")
      setSelectedMemberName("")
      setSelectedMemberIds([])
      setSchedulingType("immediate")
      setScheduleDate("")
      toast.success("Message sent/scheduled successfully!")
      refetchHistory()
      refetchScheduled()
      
    } catch (error) {
      console.error("Failed to send message", error)
      toast.error("Failed to send message")
    }
  }

  const handleCancelScheduled = async (id: number) => {
    if (confirm("Are you sure you want to cancel this scheduled message?")) {
       try {
         await cancelBulkMessage(id).unwrap()
         refetchScheduled()
         toast.success("Message cancelled successfully")
       } catch (error) {
         console.error("Failed to cancel message", error)
         toast.error("Failed to cancel message")
       }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-[#22c55e]/10 text-[#22c55e]"
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
                <Label htmlFor="select-recipient-type" className="text-base font-semibold">
                  Select Recipients
                </Label>
                <Select value={selectedRecipientType} onValueChange={handleSelectRecipientType}>
                  <SelectTrigger id="select-recipient-type" className="h-10">
                    <SelectValue placeholder="Select member group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Member</SelectItem>
                    <SelectItem value="all-members">All Members</SelectItem>
                    <SelectItem value="active-members">Active Members</SelectItem>
                    <SelectItem value="expired-members">Expired Members</SelectItem>
                    <SelectItem value="male-members">Male Members</SelectItem>
                    <SelectItem value="female-members">Female Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advance Search (Only for Individual) */}
              <div className={`space-y-3 relative ${selectedRecipientType !== "individual" && selectedRecipientType !== "" ? "opacity-50 pointer-events-none" : ""}`}>
                <Label htmlFor="search" className="text-base font-semibold">
                  Search Member
                </Label>
                <Input
                  id="search"
                  placeholder="Search by member ID or Name"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearchResults(true)
                  }} // Fixed: Added closing brace
                  onFocus={() => setShowSearchResults(true)}
                  className="h-10"
                  disabled={selectedRecipientType !== "individual" && selectedRecipientType !== ""}
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <button
                          key={member.memberId}
                          onClick={() => handleSelectMember(member.memberId, member.name)}
                          className="w-full text-left px-4 py-3 transition-colors border-b border-border last:border-b-0 hover:bg-zinc-800"
                        >
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {member.memberId}</p>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-muted-foreground text-sm">
                        No members found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Recipients Display */}
            {selectedMemberName && (
              <div className="pt-2 border-t border-border">
                <Label className="text-sm text-muted-foreground mb-2 block">Selected Recipients ({selectedMemberIds.length})</Label>
                <div className="inline-flex items-center gap-2 bg-sidebar-accent px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium">{selectedMemberName}</span>
                  <button
                    onClick={() => {
                      setSelectedMemberName("")
                      setSelectedMemberIds([])
                      setSelectedRecipientType("")
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
                    onClick={() => setSchedulingType("once")} // Changed from "scheduled" to "once" to match API
                    className={`p-4 rounded-lg border-2 transition-all ${
                      schedulingType === "once"
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
                    onClick={() => setSchedulingType("weekly")} // Default recurring type
                    className={`p-4 rounded-lg border-2 transition-all ${
                      ["weekly", "monthly", "yearly"].includes(schedulingType)
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
                        {schedulingType === "once" ? "Send Date" : "Start Date"}
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
                    {["weekly", "monthly", "yearly"].includes(schedulingType) && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="frequency" className="text-sm font-semibold">
                            Repeat Frequency
                          </Label>
                          <Select 
                            value={schedulingType} 
                            onValueChange={(value: "weekly" | "monthly" | "yearly") => setSchedulingType(value)}
                          >
                            <SelectTrigger id="frequency" className="h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
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
                          {schedulingType === "once"
                            ? `Send on ${new Date(scheduleDate).toLocaleDateString()} at ${scheduleTime}`
                            : `Starting ${new Date(scheduleDate).toLocaleDateString()} at ${scheduleTime}, repeating ${schedulingType}${recurringEndDate ? ` until ${new Date(recurringEndDate).toLocaleDateString()}` : ""}`
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
                        <Select value={newTemplateCategory} onValueChange={(value: any) => setNewTemplateCategory(value)}>
                          <SelectTrigger id="template-category" className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="offers">Offers</SelectItem>
                            <SelectItem value="member_alerts">Member Alerts</SelectItem>
                            <SelectItem value="announcements">Announcements</SelectItem>
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
                  {["all", "offers", "member_alerts", "announcements"].map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={templateCategory === cat ? "default" : "outline"}
                      onClick={() => setTemplateCategory(cat)}
                      className={templateCategory === cat ? "bg-[#E8FF00] text-black hover:bg-[#E8FF00]/80" : ""}
                    >
                      {cat.replace("_", " ").charAt(0).toUpperCase() + cat.replace("_", " ").slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Templates List */}
              <div className="grid gap-3 mt-4">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <Card key={template.templateId} className="p-4 bg-background border-[#2a2a2a] hover:border-[#E8FF00]/50 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{template.name}</h4>
                            <div className="text-xs text-muted-foreground mt-1">
                              Category: <Badge variant="outline" className="text-xs ml-1">
                                {template.category.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Created: {new Date(template.createdAt).toLocaleDateString()}</p>
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
                            onClick={() => handleDeleteTemplate(template.templateId)}
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
            <div className="flex justify-end mb-4">
               <Button size="sm" variant="outline" onClick={() => refetchHistory()} className="gap-2">
                  <RefreshCw className="h-3 w-3" /> Refresh
               </Button>
            </div>
            <div className="space-y-3">
              {historyMessages.length > 0 ? (
                historyMessages
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item) => (
                  <div key={item.messageOccurrenceId} className="p-4 bg-background rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground">{new Date(item.occurrenceTimestamp).toLocaleString()}</p>
                      </div>
                      <Badge className={`${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{item.bulkMessage?.message}</p>
                    <p className="text-xs text-muted-foreground">
                        Recipients ({item.recipients?.length || 0}): {item.recipients?.map((r: any) => r.member?.name).join(", ").slice(0, 50)}...
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No messages sent yet</p>
              )}
            </div>

            {/* Pagination for History */}
            {historyMessages.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, historyMessages.length)} of {historyMessages.length} messages
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
                    Page {currentPage} of {Math.ceil(historyMessages.length / itemsPerPage)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(historyMessages.length / itemsPerPage), prev + 1))}
                    disabled={currentPage >= Math.ceil(historyMessages.length / itemsPerPage)}
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
             <div className="flex justify-end mb-4">
               <Button size="sm" variant="outline" onClick={() => refetchScheduled()} className="gap-2">
                  <RefreshCw className="h-3 w-3" /> Refresh
               </Button>
            </div>
            <div className="space-y-3">
              {scheduledMessages.length > 0 ? (
                scheduledMessages
                  .slice((scheduledCurrentPage - 1) * itemsPerPage, scheduledCurrentPage * itemsPerPage)
                  .map((item) => (
                  <div key={item.messageOccurrenceId} className="p-4 bg-background rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground">
                          Scheduled: {new Date(item.occurrenceTimestamp).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            className={item.bulkMessage?.schedulingType !== "once" 
                              ? "bg-purple-500/10 text-purple-400" 
                              : "bg-[#00B4FF]/10 text-[#00B4FF]"}
                          >
                            {item.bulkMessage?.schedulingType === "once" ? "Scheduled" : "Recurring"}
                          </Badge>
                          {item.bulkMessage?.schedulingType !== "once" && (
                            <Badge variant="outline" className="text-xs">
                              {item.bulkMessage?.schedulingType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Cancel Actions */}
                      <button
                        onClick={() => handleCancelScheduled(item.bulkMessageId)}
                        className="text-xs text-red-500 hover:text-red-400 hover:underline transition-colors"
                      >
                         Cancel
                      </button>
                    </div>
                    <p className="text-sm mb-2">{item.bulkMessage?.message}</p>
                    <p className="text-xs text-muted-foreground">
                        Recipients ({item.recipients?.length || 0}): {item.recipients?.map((r: any) => r.member?.name).join(", ").slice(0, 50)}...
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No scheduled messages</p>
              )}
            </div>

            {/* Pagination for Scheduled */}
            {scheduledMessages.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {((scheduledCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(scheduledCurrentPage * itemsPerPage, scheduledMessages.length)} of {scheduledMessages.length} messages
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
                    Page {scheduledCurrentPage} of {Math.ceil(scheduledMessages.length / itemsPerPage)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScheduledCurrentPage(prev => Math.min(Math.ceil(scheduledMessages.length / itemsPerPage), prev + 1))}
                    disabled={scheduledCurrentPage >= Math.ceil(scheduledMessages.length / itemsPerPage)}
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
