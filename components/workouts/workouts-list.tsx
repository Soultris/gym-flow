"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Check, Search, Calendar, Send, Printer, Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { useGetMembersQuery } from "@/store/api/membersApi"
import {
  useGetWorkoutTemplatesQuery,
  useCreateWorkoutTemplateMutation,
  useUpdateWorkoutTemplateMutation,
  useDeleteWorkoutTemplateMutation,
  useAssignWorkoutMutation,
} from "@/store/api/workoutsApi"

interface Exercise {
  name: string
  reps: string
}

interface WorkoutTemplateUI {
  id: number
  name: string
  description: string
  exercises: Exercise[]
}

interface AssignedWorkout {
  id: string
  memberId: string
  memberName: string
  workoutId: number
  workoutName: string
  startDate: string
  endDate: string
  assignedDate: string
  notificationSent: boolean
  notificationType?: "sms" | "email" | "both"
}

interface MemberUI {
  id: number
  name: string
  email: string
  phone: string
}

type DialogType = "add-template" | "edit-template" | "assign-workout" | null
type WorkoutCreationMode = "select" | "customize-template" | "create-custom"

// Helper to transform API templates to UI format
import { WorkoutTemplate } from "@/store/api/workoutsApi"
const transformTemplates = (templates: WorkoutTemplate[]): WorkoutTemplateUI[] => {
  return templates.map(t => ({
    id: t.templateId,
    name: t.name,
    description: t.description || "",
    exercises: t.rows?.map((r) => ({ name: r.name, reps: r.reps })) || []
  }))
}

export function WorkoutsList() {
  const searchParams = useSearchParams()

  const [memberSearch, setMemberSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedMember, setSelectedMember] = useState<MemberUI | null>(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(memberSearch)
    }, 400)
    return () => clearTimeout(timer)
  }, [memberSearch])
  
  // API Queries
  const { data: templatesData, isLoading: templatesLoading } = useGetWorkoutTemplatesQuery()
  const { data: membersData, isLoading: membersLoading } = useGetMembersQuery({ 
    limit: 100,
    ...(debouncedSearch ? { search: debouncedSearch } : {})
  })
  
  // API Mutations
  const [createTemplate, { isLoading: isCreating }] = useCreateWorkoutTemplateMutation()
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateWorkoutTemplateMutation()
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteWorkoutTemplateMutation()
  const [assignWorkout, { isLoading: isAssigning }] = useAssignWorkoutMutation()
  
  // Transform API data to UI format
  const workoutTemplates = useMemo(() => 
    templatesData ? transformTemplates(templatesData) : [], 
    [templatesData]
  )
  
  const members: MemberUI[] = useMemo(() => 
    membersData?.members?.map(m => ({
      id: m.memberId,
      name: m.name,
      email: m.email,
      phone: m.phone
    })) || [],
    [membersData]
  )
  
  const [assignedWorkouts, setAssignedWorkouts] = useState<AssignedWorkout[]>([])
  
  // Dialog & UI State
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)
  
  // Form State for Templates
  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
  })
  const [exercises, setExercises] = useState<Array<{ name: string; reps: string }>>([
    { name: "", reps: "" }
  ])

  // Assignment Form State
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)
  const [selectedWorkoutIds, setSelectedWorkoutIds] = useState<Map<number, { startDate: string; endDate: string }>>(new Map())

  const [notificationType, setNotificationType] = useState<"sms" | "email" | "both">("both")
  
  // Workout Creation Mode

  const [customWorkoutForm, setCustomWorkoutForm] = useState({
    name: "",
    description: "",
  })
  const [customExercises, setCustomExercises] = useState<Array<{ name: string; reps: string }>>([
    { name: "", reps: "" }
  ])

  // Navigation State
  const [activeTab, setActiveTab] = useState<"templates" | "assign">("templates")
  
  // Day Selection State - per-day assignment workflow
  const [currentDay, setCurrentDay] = useState<number | null>(null) // 1, 2, 3, etc.
  const [dayWorkoutAssignments, setDayWorkoutAssignments] = useState<Array<{ 
    day: number
    workoutName: string
    exercises: Exercise[]
    startDate: string
    endDate: string
  }>>([])
  
  // Current day workout mode
  const [currentWorkoutMode, setCurrentWorkoutMode] = useState<WorkoutCreationMode | null>(null)
  const [currentSelectedTemplate, setCurrentSelectedTemplate] = useState<number | null>(null)
  
  // Date range for current day
  const [currentDayStartDate, setCurrentDayStartDate] = useState("")
  const [currentDayEndDate, setCurrentDayEndDate] = useState("")
  
  // State to track which assigned day is being viewed
  const [viewingDay, setViewingDay] = useState<number | null>(null)

  // Auto-select member from URL parameters on component mount
  useEffect(() => {
    const assignMemberId = searchParams.get("assignMemberId")
    const assignMemberName = searchParams.get("assignMemberName")
    const tab = searchParams.get("tab")
    
    if (assignMemberId && assignMemberName) {
      const memberId = parseInt(assignMemberId, 10)
      if (!isNaN(memberId) && selectedMemberId !== memberId) {
        setSelectedMemberId(memberId)
        setSelectedMember({
          id: memberId,
          name: decodeURIComponent(assignMemberName),
          email: "",
          phone: ""
        })
        setMemberSearch("")
        if (tab === "assign") {
          setActiveTab("assign")
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Filtered members based on search
  const filteredMembers = useMemo(() => {
    if (!memberSearch) return []
    return members.filter(member =>
      member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      String(member.id).includes(memberSearch)
    )
  }, [memberSearch, members])



  // Exercise Field Management
  const addExerciseField = () => {
    setExercises([...exercises, { name: "", reps: "" }])
  }

  const removeExerciseField = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  // Template CRUD Handlers
  const handleEditTemplate = (templateId: number) => {
    setSelectedTemplateId(templateId)
    const template = workoutTemplates.find(w => w.id === templateId)
    if (template) {
      setTemplateForm({
        name: template.name,
        description: template.description,
      })
      setExercises(template.exercises.map(e => ({ ...e })))
      setDialogType("edit-template")
    }
  }

  const handleDeleteTemplate = (templateId: number) => {
    setSelectedTemplateId(templateId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedTemplateId) {
      try {
        await deleteTemplate(selectedTemplateId).unwrap()
        toast.success("Template deleted successfully")
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to delete template"))
      }
    }
    setDeleteDialogOpen(false)
    setSelectedTemplateId(null)
  }

  // Custom Workout Handlers


  const handleAddCustomExercise = () => {
    setCustomExercises([...customExercises, { name: "", reps: "" }])
  }

  const handleRemoveCustomExercise = (index: number) => {
    setCustomExercises(customExercises.filter((_, i) => i !== index))
  }

  const handleUpdateCustomExercise = (index: number, field: "name" | "reps", value: string) => {
    const updated = [...customExercises]
    updated[index] = { ...updated[index], [field]: value }
    setCustomExercises(updated)
  }



  const handleSaveTemplate = async () => {
    if (!templateForm.name.trim()) return

    try {
      const rows = exercises.filter(e => e.name.trim()).map(e => ({ name: e.name, reps: e.reps }))
      
      if (dialogType === "add-template") {
        await createTemplate({
          name: templateForm.name,
          description: templateForm.description,
          rows
        }).unwrap()
        toast.success("Template created successfully")
      } else if (dialogType === "edit-template" && selectedTemplateId) {
        await updateTemplate({
          id: selectedTemplateId,
          data: {
            name: templateForm.name,
            description: templateForm.description,
            rows
          }
        }).unwrap()
        toast.success("Template updated successfully")
      }
      closeDialog()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save template"))
    }
  }

  const handleSelectTemplateForCustomization = (templateId: number) => {
    setCurrentSelectedTemplate(templateId)
    const template = workoutTemplates.find(t => t.id === templateId)
    if (template) {
      setCustomWorkoutForm({
        name: template.name,
        description: template.description,
      })
      setCustomExercises(template.exercises.map(e => ({ ...e })))
    }
  }

  // Assignment Handlers
  const handleAssignWorkoutForDay = () => {
    if (!currentDay || !selectedMemberId || !currentDayStartDate || !currentDayEndDate) return

    let exercises: Exercise[] = []
    let workoutName = ""

    if (currentWorkoutMode === "select" && currentSelectedTemplate) {
      const template = workoutTemplates.find(t => t.id === currentSelectedTemplate)
      if (!template) return
      exercises = template.exercises
      workoutName = template.name
    } else if (currentWorkoutMode === "customize-template" && currentSelectedTemplate) {
      if (!customWorkoutForm.name.trim()) return
      exercises = customExercises.filter(e => e.name.trim())
      workoutName = customWorkoutForm.name
    } else if (currentWorkoutMode === "create-custom") {
      if (!customWorkoutForm.name.trim()) return
      exercises = customExercises.filter(e => e.name.trim())
      workoutName = customWorkoutForm.name
    } else {
      return
    }

    // Add assignment for this day
    setDayWorkoutAssignments([...dayWorkoutAssignments, { 
      day: currentDay, 
      workoutName, 
      exercises,
      startDate: currentDayStartDate,
      endDate: currentDayEndDate
    }])
    
    // Reset for next day
    setCurrentDay(null)
    setCurrentWorkoutMode(null)
    setCurrentSelectedTemplate(null)
    setCurrentDayStartDate("")
    setCurrentDayEndDate("")
    setCustomWorkoutForm({ name: "", description: "" })
    setCustomExercises([{ name: "", reps: "" }])
  }

  const handleFinishAndAssignAll = async () => {
    if (!selectedMemberId || !selectedMember || dayWorkoutAssignments.length === 0) return

    try {
      // Assign each day's workout to the backend
      for (const assignment of dayWorkoutAssignments) {
        await assignWorkout({
          memberId: selectedMemberId,
          name: assignment.workoutName,
          dayNumber: assignment.day,
          startDate: assignment.startDate,
          endDate: assignment.endDate,
          rows: assignment.exercises.map(e => ({ name: e.name, reps: e.reps }))
        }).unwrap()
      }
      
      toast.success(`${dayWorkoutAssignments.length} workout(s) assigned to ${selectedMember.name}`)
      
      // Reset all forms
      setMemberSearch("")
      setSelectedMemberId(null)
      setSelectedMember(null)
      setCurrentDay(null)
      setDayWorkoutAssignments([])
      setCurrentWorkoutMode(null)
      setCurrentSelectedTemplate(null)
      setCurrentDayStartDate("")
      setCurrentDayEndDate("")
      setCustomWorkoutForm({ name: "", description: "" })
      setCustomExercises([{ name: "", reps: "" }])
      setNotificationType("both")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to assign workouts"))
    }
  }

  const handleSendNotification = (assignedWorkoutId: string, type: "sms" | "email") => {
    setAssignedWorkouts(assignedWorkouts.map(aw =>
      aw.id === assignedWorkoutId
        ? { ...aw, notificationSent: true, notificationType: type }
        : aw
    ))
  }

  const handlePrintWorkout = (assignedWorkoutId: string) => {
    const assignment = assignedWorkouts.find(a => a.id === assignedWorkoutId)
    const template = workoutTemplates.find(t => t.id === assignment?.workoutId)
    
    if (!assignment || !template) return

    const printWindow = window.open("", "", "width=800,height=600")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>${assignment.workoutName} - ${assignment.memberName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { border-bottom: 2px solid #E8FF00; padding-bottom: 15px; margin-bottom: 20px; }
            .member-info { background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
            .workout-info { margin: 20px 0; }
            .exercise { padding: 10px; border-left: 3px solid #E8FF00; margin: 10px 0; background: #fafafa; }
            .date-range { color: #666; font-size: 14px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${assignment.workoutName}</h1>
            <p class="date-range">Period: ${assignment.startDate} to ${assignment.endDate}</p>
          </div>
          
          <div class="member-info">
            <strong>Member:</strong> ${assignment.memberName}<br>
            <strong>ID:</strong> ${assignment.memberId}<br>
            <strong>Assigned:</strong> ${assignment.assignedDate}
          </div>

          <div class="workout-info">
            <h3>Description</h3>
            <p>${template.description}</p>
          </div>

          <h3>Exercises</h3>
          ${template.exercises.map(ex => `
            <div class="exercise">
              <strong>${ex.name}</strong><br>
              Reps: ${ex.reps}
            </div>
          `).join("")}

          <div class="footer">
            <p>Printed from Gym Flow Management System</p>
            <p>Print Date: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const closeDialog = () => {
    setDialogType(null)
    setSelectedTemplateId(null)
    setTemplateForm({ name: "", description: "" })
    setExercises([{ name: "", reps: "" }])
    setMemberSearch("")
    setSelectedMemberId(null)
    setSelectedMember(null)
    setSelectedWorkoutIds(new Map())
    setNotificationType("both")
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Navigation */}
      <div className="space-y-6">


        {/* Navigation Buttons */}
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => {
              setActiveTab("templates")
              setMemberSearch("")
              setSelectedMemberId(null)
              setSelectedMember(null)
              setSelectedWorkoutIds(new Map())
            }}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "templates"
                ? "text-foreground border-b-2 border-[#E8FF00] -mb-0.5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Workout Templates
          </button>
          <button
            onClick={() => setActiveTab("assign")}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "assign"
                ? "text-foreground border-b-2 border-[#E8FF00] -mb-0.5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Assign to Members
          </button>
        </div>
      </div>

      {/* Workout Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={dialogType === "add-template"} onOpenChange={(open) => {
              if (!open) closeDialog()
              else setDialogType("add-template")
            }}>
              <DialogTrigger asChild>
                <Button className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Create Workout Template</DialogTitle>
                  <DialogDescription>Create a new reusable workout template with exercises</DialogDescription>
                </DialogHeader>
                <form className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateName">Template Name *</Label>
                    <Input 
                      id="templateName" 
                      placeholder="e.g., Chest Builder" 
                      required
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="templateDescription">Description</Label>
                    <Textarea 
                      id="templateDescription" 
                      placeholder="Describe the workout template" 
                      rows={3}
                      value={templateForm.description}
                      onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Exercises & Reps</Label>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={addExerciseField}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Exercise
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {exercises.map((exercise, index) => (
                        <div key={index} className="flex gap-2">
                          <Input 
                            placeholder="Exercise name" 
                            className="flex-1"
                            value={exercise.name}
                            onChange={(e) => {
                              const newExercises = [...exercises]
                              newExercises[index].name = e.target.value
                              setExercises(newExercises)
                            }}
                          />
                          <Input 
                            placeholder="e.g., 12 x 4" 
                            className="w-24"
                            value={exercise.reps}
                            onChange={(e) => {
                              const newExercises = [...exercises]
                              newExercises[index].reps = e.target.value
                              setExercises(newExercises)
                            }}
                          />
                          {exercises.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="text-destructive"
                              onClick={() => removeExerciseField(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={closeDialog}>
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleSaveTemplate}
                      className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
                    >
                      Create Template
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Template Dialog */}
          <Dialog open={dialogType === "edit-template"} onOpenChange={(open) => {
            if (!open) closeDialog()
          }}>
            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle>Edit Workout Template</DialogTitle>
                <DialogDescription>Update the template details and exercises</DialogDescription>
              </DialogHeader>
              <form className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="editTemplateName">Template Name *</Label>
                  <Input 
                    id="editTemplateName" 
                    placeholder="e.g., Chest Builder" 
                    required
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTemplateDescription">Description</Label>
                  <Textarea 
                    id="editTemplateDescription" 
                    placeholder="Describe the workout template" 
                    rows={3}
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Exercises & Reps</Label>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={addExerciseField}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Exercise
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          placeholder="Exercise name" 
                          className="flex-1"
                          value={exercise.name}
                          onChange={(e) => {
                            const newExercises = [...exercises]
                            newExercises[index].name = e.target.value
                            setExercises(newExercises)
                          }}
                        />
                        <Input 
                          placeholder="e.g., 12 x 4" 
                          className="w-24"
                          value={exercise.reps}
                          onChange={(e) => {
                            const newExercises = [...exercises]
                            newExercises[index].reps = e.target.value
                            setExercises(newExercises)
                          }}
                        />
                        {exercises.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => removeExerciseField(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleSaveTemplate}
                    className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
                  >
                    Update Template
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="bg-card border-border max-w-sm">
              <DialogHeader>
                <DialogTitle>Delete Template?</DialogTitle>
                <DialogDescription>
                  This will delete the template and cannot be undone. Existing assignments will not be affected.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Templates Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {workoutTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="p-5 transition-all hover:shadow-lg"
              >
                <div className="mb-3">
                  <h3 className="text-base font-semibold">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{template.description}</p>
                </div>

                <div className="mb-4 space-y-2">
                  {template.exercises.map((exercise, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">{exercise.reps}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
                    onClick={() => handleEditTemplate(template.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Assign to Members Tab */}
      {activeTab === "assign" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Assigned workout to members</h3>
            
            {/* Member Search Section */}
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="memberSearch">Search member</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="memberSearch"
                    placeholder="Search member by name or ID" 
                    className="pl-10"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                </div>
              </div>

              {memberSearch && (
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  {filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setSelectedMemberId(member.id)
                        setSelectedMember(member)
                        setMemberSearch("")
                        setCurrentDay(null)
                        setDayWorkoutAssignments([])
                      }}
                      className="w-full p-3 text-left hover:bg-muted border-b last:border-b-0 transition-colors"
                    >
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.id} • {member.phone}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Member & Day-by-Day Assignment */}
            {selectedMemberId && (
              <div className="space-y-6 mb-6">
                <div className="p-4 bg-accent/10 rounded-lg border border-[#E8FF00]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Selected Member</p>
                      <p className="text-lg font-semibold">{selectedMember?.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMemberId(null)
                        setSelectedMember(null)
                        setCurrentDay(null)
                        setDayWorkoutAssignments([])
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Day Selection Buttons */}

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Add Workout Plan for:</p>
                    <div className="flex flex-wrap gap-2">
                      {/* Show Day 1 always */}
                      <button
                        onClick={() => {
                          if (dayWorkoutAssignments.some(a => a.day === 1)) {
                            setViewingDay(1)
                          } else {
                            setCurrentDay(1)
                            setViewingDay(null)
                          }
                        }}
                        className={`
                          px-4 py-2 rounded-lg border-2 font-semibold transition-all flex items-center gap-1
                          ${dayWorkoutAssignments.some(a => a.day === 1)
                            ? viewingDay === 1
                              ? "border-[#E8FF00] bg-[#E8FF00] text-black"
                              : "border-[#E8FF00] bg-[#E8FF00]/10 text-foreground hover:bg-[#E8FF00]/20"
                            : "border-dashed border-[#E8FF00] bg-transparent text-[#E8FF00] hover:bg-[#E8FF00]/10"
                          }
                        `}
                      >
                        {!dayWorkoutAssignments.some(a => a.day === 1) && <Plus className="h-4 w-4" />}
                        Day 01
                      </button>

                      {/* Show assigned days as clickable tabs */}
                      {dayWorkoutAssignments.filter(a => a.day !== 1).map(assignment => (
                        <button
                          key={`day-${assignment.day}`}
                          onClick={() => setViewingDay(assignment.day)}
                          className={`
                            px-4 py-2 rounded-lg border-2 font-semibold transition-all
                            ${viewingDay === assignment.day
                              ? "border-[#E8FF00] bg-[#E8FF00] text-black"
                              : "border-[#E8FF00] bg-[#E8FF00]/10 text-foreground hover:bg-[#E8FF00]/20"
                            }
                          `}
                        >
                          Day {String(assignment.day).padStart(2, "0")}
                        </button>
                      ))}

                      {/* Show + button to add next available day */}
                      {dayWorkoutAssignments.length > 0 && dayWorkoutAssignments.length < 30 && (
                        <button
                          onClick={() => {
                            setCurrentDay(dayWorkoutAssignments.length + 1)
                            setViewingDay(null)
                          }}
                          className="px-4 py-2 rounded-lg border-2 border-dashed border-[#E8FF00] bg-transparent text-[#E8FF00] font-bold hover:bg-[#E8FF00]/10 transition-all flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Day {String(dayWorkoutAssignments.length + 1).padStart(2, "0")}
                        </button>
                      )}
                    </div>
                  </div>


                {/* Viewing Assigned Day Content */}
                {viewingDay && !currentDay && (
                  <div className="p-4 border-2 border-[#E8FF00]/50 rounded-lg bg-[#E8FF00]/5 space-y-4">
                    {(() => {
                      const assignment = dayWorkoutAssignments.find(a => a.day === viewingDay)
                      if (!assignment) return null
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 rounded-full bg-[#E8FF00] text-black font-bold text-lg flex items-center justify-center">
                                {String(viewingDay).padStart(2, "0")}
                              </span>
                              <div>
                                <h4 className="text-lg font-semibold">{assignment.workoutName}</h4>
                                <p className="text-sm text-muted-foreground">📅 {assignment.startDate} to {assignment.endDate}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setDayWorkoutAssignments(dayWorkoutAssignments.filter(a => a.day !== viewingDay))
                                setViewingDay(null)
                              }}
                              className="text-xs text-destructive hover:text-destructive/80 font-medium px-3 py-1 border border-destructive rounded hover:bg-destructive/10"
                            >
                              Remove Day
                            </button>
                          </div>

                          {/* Editable Exercises */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">Exercises</p>
                              <button
                                onClick={() => {
                                  const updated = dayWorkoutAssignments.map(a => 
                                    a.day === viewingDay 
                                      ? { ...a, exercises: [...a.exercises, { name: "", reps: "" }] }
                                      : a
                                  )
                                  setDayWorkoutAssignments(updated)
                                }}
                                className="text-xs bg-[#E8FF00] text-black px-2 py-1 rounded hover:bg-[#E8FF00]/80"
                              >
                                + Add Exercise
                              </button>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {assignment.exercises.map((ex, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <Input 
                                    placeholder="Exercise name"
                                    value={ex.name}
                                    onChange={(e) => {
                                      const updated = dayWorkoutAssignments.map(a => {
                                        if (a.day !== viewingDay) return a
                                        const newExercises = [...a.exercises]
                                        newExercises[idx] = { ...newExercises[idx], name: e.target.value }
                                        return { ...a, exercises: newExercises }
                                      })
                                      setDayWorkoutAssignments(updated)
                                    }}
                                    className="flex-1"
                                  />
                                  <Input 
                                    placeholder="Reps (e.g., 12 x 4)"
                                    value={ex.reps}
                                    onChange={(e) => {
                                      const updated = dayWorkoutAssignments.map(a => {
                                        if (a.day !== viewingDay) return a
                                        const newExercises = [...a.exercises]
                                        newExercises[idx] = { ...newExercises[idx], reps: e.target.value }
                                        return { ...a, exercises: newExercises }
                                      })
                                      setDayWorkoutAssignments(updated)
                                    }}
                                    className="w-32"
                                  />
                                  <button
                                    onClick={() => {
                                      const updated = dayWorkoutAssignments.map(a => {
                                        if (a.day !== viewingDay) return a
                                        return { ...a, exercises: a.exercises.filter((_, i) => i !== idx) }
                                      })
                                      setDayWorkoutAssignments(updated)
                                    }}
                                    className="text-destructive hover:text-destructive/80 px-2"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}

                {/* Dialog for configuring workout */}
                <Dialog open={!!currentDay && !viewingDay} onOpenChange={(open) => {
                  if (!open) {
                    setCurrentDay(null)
                    setCurrentWorkoutMode(null)
                    setCurrentSelectedTemplate(null)
                    setCurrentDayStartDate("")
                    setCurrentDayEndDate("")
                    setCustomWorkoutForm({ name: "", description: "" })
                    setCustomExercises([{ name: "", reps: "" }])
                  }
                }}>
                  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card text-card-foreground border-border">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#E8FF00] text-black font-bold text-sm flex items-center justify-center">
                          {String(currentDay).padStart(2, "0")}
                        </span>
                        Configure Day {String(currentDay).padStart(2, "0")} Workout
                      </DialogTitle>
                      <DialogDescription>
                        Set up the workout plan for this day. You can use a template or create a custom workout.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      {/* Date Range Inputs */}
                      <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded">
                        <div className="space-y-2">
                          <Label htmlFor="startDate" className="text-sm font-medium">Start Date *</Label>
                          <Input 
                            id="startDate"
                            type="date"
                            value={currentDayStartDate}
                            onChange={(e) => setCurrentDayStartDate(e.target.value)}
                            className="bg-background [&::-webkit-calendar-picker-indicator]:invert"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate" className="text-sm font-medium">End Date *</Label>
                          <Input 
                            id="endDate"
                            type="date"
                            value={currentDayEndDate}
                            onChange={(e) => setCurrentDayEndDate(e.target.value)}
                            className="bg-background [&::-webkit-calendar-picker-indicator]:invert"
                          />
                        </div>
                      </div>

                      {/* Workout Type Selection */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Choose workout option:</p>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setCurrentWorkoutMode("select")}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              currentWorkoutMode === "select"
                                ? "border-[#E8FF00] bg-[#E8FF00]/10 text-foreground"
                                : "border-border bg-muted text-muted-foreground hover:border-[#E8FF00]"
                            }`}
                          >
                            Use Template
                          </button>
                          <button
                            onClick={() => setCurrentWorkoutMode("customize-template")}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              currentWorkoutMode === "customize-template"
                                ? "border-[#E8FF00] bg-[#E8FF00]/10 text-foreground"
                                : "border-border bg-muted text-muted-foreground hover:border-[#E8FF00]"
                            }`}
                          >
                            Customize Template
                          </button>
                          <button
                            onClick={() => setCurrentWorkoutMode("create-custom")}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              currentWorkoutMode === "create-custom"
                                ? "border-[#E8FF00] bg-[#E8FF00]/10 text-foreground"
                                : "border-border bg-muted text-muted-foreground hover:border-[#E8FF00]"
                            }`}
                          >
                            Create Custom
                          </button>
                        </div>
                      </div>

                      {/* Template Selection */}
                      {currentWorkoutMode === "select" && !currentSelectedTemplate && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                          <p className="font-medium">Select a workout template:</p>
                          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                            {workoutTemplates.map((template) => (
                              <button
                                key={template.id}
                                onClick={() => setCurrentSelectedTemplate(template.id)}
                                className="p-3 rounded-lg border-2 border-border bg-background hover:border-[#E8FF00] transition-all text-left"
                              >
                                <p className="font-medium text-sm">{template.name}</p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                                <div className="mt-2 flex gap-2">
                                  <Badge variant="secondary" className="text-[10px]">{template.exercises.length} Exercises</Badge>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Selected Template Preview */}
                      {currentWorkoutMode === "select" && currentSelectedTemplate && (
                        <div className="space-y-4 p-4 border rounded-lg bg-[#E8FF00]/5 border-[#E8FF00]/20">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {workoutTemplates.find(t => t.id === currentSelectedTemplate)?.name}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {workoutTemplates.find(t => t.id === currentSelectedTemplate)?.description}
                              </p>
                            </div>
                            <button 
                              onClick={() => setCurrentSelectedTemplate(null)}
                              className="text-xs text-muted-foreground hover:text-foreground underline"
                            >
                              Change Template
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Included Exercises:</p>
                            <div className="bg-background rounded-md border p-3 space-y-2 max-h-48 overflow-y-auto">
                              {workoutTemplates.find(t => t.id === currentSelectedTemplate)?.exercises.map((ex, idx) => (
                                <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0 border-border/50">
                                  <span>{ex.name}</span>
                                  <span className="font-mono text-muted-foreground">{ex.reps}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Customize Template */}
                      {currentWorkoutMode === "customize-template" && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                          {!currentSelectedTemplate ? (
                            <div className="space-y-4">
                              <p className="font-medium">Select a template to customize:</p>
                              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                                {workoutTemplates.map((template) => (
                                  <button
                                    key={template.id}
                                    onClick={() => handleSelectTemplateForCustomization(template.id)}
                                    className="p-3 rounded-lg border-2 border-border bg-background hover:border-[#E8FF00] transition-all text-left"
                                  >
                                    <p className="font-medium text-sm">{template.name}</p>
                                    <div className="mt-2 flex gap-2">
                                      <Badge variant="secondary" className="text-[10px]">{template.exercises.length} Exercises</Badge>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">Customizing: {customWorkoutForm.name}</h4>
                                <button 
                                  onClick={() => {
                                    setCurrentSelectedTemplate(null)
                                    setCustomWorkoutForm({ name: "", description: "" })
                                    setCustomExercises([{ name: "", reps: "" }])
                                  }}
                                  className="text-xs text-muted-foreground hover:text-foreground underline"
                                >
                                  Change Template
                                </button>
                              </div>

                              <div className="space-y-2">
                                <Label>Exercises</Label>
                                <div className="flex justify-end">
                                  <button
                                    onClick={handleAddCustomExercise}
                                    className="text-xs bg-[#E8FF00] text-black px-2 py-1 rounded hover:bg-[#E8FF00]/80 font-medium"
                                  >
                                    + Add Exercise
                                  </button>
                                </div>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {customExercises.map((ex, idx) => (
                                    <div key={idx} className="flex gap-2 items-start">
                                      <Input 
                                        placeholder="Exercise name"
                                        value={ex.name}
                                        onChange={(e) => handleUpdateCustomExercise(idx, "name", e.target.value)}
                                        className="flex-1"
                                      />
                                      <Input 
                                        placeholder="Reps (e.g., 12 x 4)"
                                        value={ex.reps}
                                        onChange={(e) => handleUpdateCustomExercise(idx, "reps", e.target.value)}
                                        className="w-32"
                                      />
                                      <button
                                        onClick={() => handleRemoveCustomExercise(idx)}
                                        className="text-destructive hover:text-destructive/80 px-2"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Create Custom Workout */}
                      {currentWorkoutMode === "create-custom" && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="newWorkoutName">Workout Name *</Label>
                              <Input 
                                id="newWorkoutName"
                                placeholder="e.g., Full Body Strength"
                                value={customWorkoutForm.name}
                                onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, name: e.target.value})}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="newWorkoutDesc">Description</Label>
                              <Textarea 
                                id="newWorkoutDesc"
                                placeholder="Describe this custom workout"
                                rows={2}
                                value={customWorkoutForm.description}
                                onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, description: e.target.value})}
                              />
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Exercises List</Label>
                                <button
                                  onClick={handleAddCustomExercise}
                                  className="text-xs bg-[#E8FF00] text-black px-2 py-1 rounded hover:bg-[#E8FF00]/80 font-medium"
                                >
                                  + Add Exercise
                                </button>
                              </div>
                              <div className="space-y-2">
                                {customExercises.map((ex, idx) => (
                                  <div key={idx} className="flex gap-2 items-start">
                                    <Input 
                                      placeholder="Exercise name"
                                      value={ex.name}
                                      onChange={(e) => handleUpdateCustomExercise(idx, "name", e.target.value)}
                                      className="flex-1"
                                    />
                                    <Input 
                                      placeholder="Reps (e.g., 12 x 4)"
                                      value={ex.reps}
                                      onChange={(e) => handleUpdateCustomExercise(idx, "reps", e.target.value)}
                                      className="w-32"
                                    />
                                    <button
                                      onClick={() => handleRemoveCustomExercise(idx)}
                                      className="text-destructive hover:text-destructive/80 px-2"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentDay(null)
                          setCurrentWorkoutMode(null)
                          setCurrentSelectedTemplate(null)
                          setCurrentDayStartDate("")
                          setCurrentDayEndDate("")
                          setCustomWorkoutForm({ name: "", description: "" })
                          setCustomExercises([{ name: "", reps: "" }])
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAssignWorkoutForDay}
                        disabled={!currentDayStartDate || !currentDayEndDate || !currentWorkoutMode}
                        className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Assign Workout
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>












              </div>
            )}

            {/* Final Assign All Button */}
            {selectedMemberId && dayWorkoutAssignments.length > 0 && (
              <Button
                className="w-full bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
                onClick={handleFinishAndAssignAll}
              >
                <Check className="h-4 w-4 mr-2" />
                Confirm & Assign All Workouts
              </Button>
            )}
          </Card>

          {/* Assigned Workouts List */}
          {assignedWorkouts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assigned Workouts</h3>
              <div className="space-y-3">
                {assignedWorkouts.map((assignment) => {
                  const template = workoutTemplates.find(t => t.id === assignment.workoutId)
                  return (
                    <Card key={assignment.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{assignment.workoutName}</h4>
                            <Badge variant="secondary">{assignment.memberName}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                            <div>
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {assignment.startDate} to {assignment.endDate}
                            </div>
                            <div>
                              Assigned: {assignment.assignedDate}
                            </div>
                          </div>
                          {template && (
                            <div className="text-sm mb-3">
                              <p className="text-muted-foreground">{template.exercises.length} exercises</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintWorkout(assignment.id)}
                          >
                            <Printer className="h-4 w-4 mr-1" />
                            Print
                          </Button>
                          {!assignment.notificationSent ? (
                            <>
                              {(assignment.notificationType === "sms" || assignment.notificationType === "both") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendNotification(assignment.id, "sms")}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  SMS
                                </Button>
                              )}
                              {(assignment.notificationType === "email" || assignment.notificationType === "both") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendNotification(assignment.id, "email")}
                                >
                                  <Mail className="h-4 w-4 mr-1" />
                                  Email
                                </Button>
                              )}
                            </>
                          ) : (
                            <Badge className="bg-green-600">Notified</Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
