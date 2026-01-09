"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Check, Search, Calendar, Send, Printer, Mail, X } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"

interface Exercise {
  name: string
  reps: string
}

interface WorkoutTemplate {
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

interface Member {
  id: string
  name: string
  email: string
  phone: string
}

type DialogType = "add-template" | "edit-template" | "assign-workout" | null
type WorkoutCreationMode = "select" | "customize-template" | "create-custom"

const mockMembers: Member[] = [
  { id: "M001", name: "John Smith", email: "john@example.com", phone: "+1234567890" },
  { id: "M002", name: "Sarah Johnson", email: "sarah@example.com", phone: "+1234567891" },
  { id: "M003", name: "Mike Wilson", email: "mike@example.com", phone: "+1234567892" },
  { id: "M004", name: "Emily Davis", email: "emily@example.com", phone: "+1234567893" },
  { id: "M005", name: "Chris Brown", email: "chris@example.com", phone: "+1234567894" },
]

const initialWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: 1,
    name: "Chest Builder",
    description: "Focuses on developing chest muscles using exercises like bench press, push-ups, and chest flys. Helps increase upper body strength and muscle size.",
    exercises: [
      { name: "Upper Chest", reps: "12 x 4" },
      { name: "Middle Chest", reps: "10 x 4" },
      { name: "Lower Chest", reps: "12 x 4" },
      { name: "Front Shoulders", reps: "10 x 3" },
      { name: "Triceps", reps: "12 x 3" },
    ],
  },
  {
    id: 2,
    name: "Leg Day",
    description: "Complete leg workout targeting quads, hamstrings, and calves for powerful lower body development.",
    exercises: [
      { name: "Squats", reps: "12 x 4" },
      { name: "Leg Press", reps: "10 x 4" },
      { name: "Leg Curls", reps: "12 x 4" },
      { name: "Calf Raises", reps: "15 x 3" },
    ],
  },
  {
    id: 3,
    name: "Back & Biceps",
    description: "Back strengthening routine with bicep curls to build a strong back and arm muscles.",
    exercises: [
      { name: "Pull-ups", reps: "10 x 4" },
      { name: "Rows", reps: "12 x 4" },
      { name: "Bicep Curls", reps: "12 x 3" },
      { name: "Lat Pulldowns", reps: "10 x 3" },
    ],
  },
  {
    id: 4,
    name: "Shoulders & Arms",
    description: "Comprehensive shoulder and arm workout for defined shoulders and strong arms.",
    exercises: [
      { name: "Shoulder Press", reps: "10 x 4" },
      { name: "Lateral Raises", reps: "12 x 3" },
      { name: "Barbell Curls", reps: "10 x 3" },
      { name: "Tricep Dips", reps: "12 x 3" },
    ],
  },
]

export function WorkoutsList() {
  const searchParams = useSearchParams()
  
  // Template Management State
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(initialWorkoutTemplates)
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
  const [memberSearch, setMemberSearch] = useState("")
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [selectedWorkoutIds, setSelectedWorkoutIds] = useState<Map<number, { startDate: string; endDate: string }>>(new Map())
  const [notificationType, setNotificationType] = useState<"sms" | "email" | "both">("both")
  
  // Workout Creation Mode
  const [workoutCreationMode, setWorkoutCreationMode] = useState<WorkoutCreationMode>("select")
  const [selectedTemplateForCustomization, setSelectedTemplateForCustomization] = useState<number | null>(null)
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

  // Auto-select member from URL parameters on component mount
  useEffect(() => {
    const assignMemberId = searchParams.get("assignMemberId")
    const assignMemberName = searchParams.get("assignMemberName")
    const tab = searchParams.get("tab")
    
    if (assignMemberId && assignMemberName) {
      setSelectedMemberId(assignMemberId)
      setMemberSearch(decodeURIComponent(assignMemberName))
      if (tab === "assign") {
        setActiveTab("assign")
      }
    }
  }, [searchParams])

  // Filtered members based on search
  const filteredMembers = useMemo(() => {
    return mockMembers.filter(member =>
      member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.id.toLowerCase().includes(memberSearch.toLowerCase())
    )
  }, [memberSearch])

  const selectedTemplate = selectedTemplateId 
    ? workoutTemplates.find(w => w.id === selectedTemplateId) 
    : null

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

  const handleConfirmDelete = () => {
    if (selectedTemplateId) {
      setWorkoutTemplates(workoutTemplates.filter(w => w.id !== selectedTemplateId))
    }
    setDeleteDialogOpen(false)
    setSelectedTemplateId(null)
  }

  // Custom Workout Handlers
  const handleLoadTemplateForCustomization = (templateId: number) => {
    const template = workoutTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplateForCustomization(templateId)
      setCustomWorkoutForm({
        name: template.name,
        description: template.description,
      })
      setCustomExercises(template.exercises.map(e => ({ ...e })))
    }
  }

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

  const handleResetCustomWorkout = () => {
    setSelectedTemplateForCustomization(null)
    setCustomWorkoutForm({ name: "", description: "" })
    setCustomExercises([{ name: "", reps: "" }])
  }

  const handleSaveTemplate = () => {
    if (!templateForm.name.trim()) return

    if (dialogType === "add-template") {
      const newTemplate: WorkoutTemplate = {
        id: Math.max(...workoutTemplates.map(w => w.id), 0) + 1,
        name: templateForm.name,
        description: templateForm.description,
        exercises: exercises.filter(e => e.name.trim()),
      }
      setWorkoutTemplates([...workoutTemplates, newTemplate])
    } else if (dialogType === "edit-template" && selectedTemplateId) {
      setWorkoutTemplates(workoutTemplates.map(w => 
        w.id === selectedTemplateId 
          ? {
              ...w,
              name: templateForm.name,
              description: templateForm.description,
              exercises: exercises.filter(e => e.name.trim()),
            }
          : w
      ))
    }
    closeDialog()
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

  const handleFinishAndAssignAll = () => {
    if (!selectedMemberId || dayWorkoutAssignments.length === 0) return

    const selectedMember = mockMembers.find(m => m.id === selectedMemberId)
    if (!selectedMember) return

    const newAssignments: AssignedWorkout[] = dayWorkoutAssignments.map((assignment, idx) => ({
      id: `assigned-${Date.now()}-${idx}`,
      memberId: selectedMemberId,
      memberName: selectedMember.name,
      workoutId: -1,
      workoutName: assignment.workoutName,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      assignedDate: new Date().toISOString().split('T')[0],
      notificationSent: false,
      notificationType,
    }))

    setAssignedWorkouts([...assignedWorkouts, ...newAssignments])
    
    // Reset all forms
    setMemberSearch("")
    setSelectedMemberId(null)
    setCurrentDay(null)
    setDayWorkoutAssignments([])
    setCurrentWorkoutMode(null)
    setCurrentSelectedTemplate(null)
    setCurrentDayStartDate("")
    setCurrentDayEndDate("")
    setCustomWorkoutForm({ name: "", description: "" })
    setCustomExercises([{ name: "", reps: "" }])
    setNotificationType("both")
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
    setSelectedWorkoutIds(new Map())
    setNotificationType("both")
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Navigation */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Workout Master</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => {
              setActiveTab("templates")
              setMemberSearch("")
              setSelectedMemberId(null)
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
                      <p className="text-lg font-semibold">{mockMembers.find(m => m.id === selectedMemberId)?.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMemberId(null)
                        setCurrentDay(null)
                        setDayWorkoutAssignments([])
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Assigned Days Summary */}
                {dayWorkoutAssignments.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-semibold">Assigned Workout Days:</p>
                    <div className="space-y-2">
                      {dayWorkoutAssignments.map((assignment, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg border border-border flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="inline-block w-8 h-8 rounded-full bg-[#E8FF00] text-black text-sm font-bold flex items-center justify-center">
                                {assignment.day}
                              </span>
                              <span className="font-medium">{assignment.workoutName}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 ml-10">
                              📅 {assignment.startDate} to {assignment.endDate}
                            </p>
                            <p className="text-xs text-muted-foreground ml-10">
                              💪 {assignment.exercises.length} exercises
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setDayWorkoutAssignments(dayWorkoutAssignments.filter((_, i) => i !== idx))
                            }}
                            className="text-xs text-destructive hover:text-destructive/80 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Day Selection Buttons */}
                {!currentDay && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Add Workout Plan for:</p>
                    <div className="flex flex-wrap gap-2">
                      {/* Show Day 1 always */}
                      <button
                        onClick={() => setCurrentDay(1)}
                        disabled={dayWorkoutAssignments.some(a => a.day === 1)}
                        className={`
                          px-4 py-2 rounded-lg border-2 font-semibold transition-all
                          ${dayWorkoutAssignments.some(a => a.day === 1)
                            ? "border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            : "border-[#E8FF00] bg-[#E8FF00]/10 text-foreground hover:bg-[#E8FF00]/20"
                          }
                        `}
                      >
                        Day 01
                      </button>

                      {/* Show Days 2-7 if they're not assigned or are available */}
                      {dayWorkoutAssignments.map(assignment => (
                        <button
                          key={`day-${assignment.day}`}
                          disabled
                          className="px-4 py-2 rounded-lg border-2 border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50 font-semibold"
                        >
                          Day {String(assignment.day).padStart(2, "0")}
                        </button>
                      ))}

                      {/* Show + button to add next available day */}
                      {dayWorkoutAssignments.length > 0 && dayWorkoutAssignments.length < 30 && (
                        <button
                          onClick={() => setCurrentDay(dayWorkoutAssignments.length + 1)}
                          className="px-4 py-2 rounded-lg border-2 border-dashed border-[#E8FF00] bg-transparent text-[#E8FF00] font-bold hover:bg-[#E8FF00]/10 transition-all flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Day {String(dayWorkoutAssignments.length + 1).padStart(2, "0")}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Date Range Selection for Current Day */}
                {currentDay && !currentWorkoutMode && (
                  <div className="space-y-4 p-4 border-2 border-[#E8FF00]/50 rounded-lg bg-[#E8FF00]/5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className=" w-10 h-10 rounded-full bg-[#E8FF00] text-black font-bold text-lg flex items-center justify-center">
                        {String(currentDay).padStart(2, "0")}
                      </span>
                      <h4 className="text-lg font-semibold">Configure Day {String(currentDay).padStart(2, "0")} Workout</h4>
                    </div>

                    {/* Date Range Inputs */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-sm font-medium">Start Date *</Label>
                        <Input 
                          id="startDate"
                          type="date"
                          value={currentDayStartDate}
                          onChange={(e) => setCurrentDayStartDate(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-sm font-medium">End Date *</Label>
                        <Input 
                          id="endDate"
                          type="date"
                          value={currentDayEndDate}
                          onChange={(e) => setCurrentDayEndDate(e.target.value)}
                          className="bg-background"
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
                  </div>
                )}

                {/* Template Selection */}
                {currentDay && currentWorkoutMode === "select" && !currentSelectedTemplate && (
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
                          <p className="text-xs text-muted-foreground mt-1">{template.exercises.length} exercises</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Template Confirmation */}
                {currentDay && currentWorkoutMode === "select" && currentSelectedTemplate && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    {workoutTemplates.find(t => t.id === currentSelectedTemplate) && (
                      <>
                        <div>
                          <p className="font-semibold">{workoutTemplates.find(t => t.id === currentSelectedTemplate)?.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{workoutTemplates.find(t => t.id === currentSelectedTemplate)?.description}</p>
                        </div>
                        <div className="space-y-2 bg-background p-3 rounded">
                          <p className="text-sm font-medium">Exercises:</p>
                          {workoutTemplates.find(t => t.id === currentSelectedTemplate)?.exercises.map((ex, idx) => (
                            <div key={idx} className="text-sm">
                              • {ex.name} - {ex.reps}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Customize Template */}
                {currentDay && currentWorkoutMode === "customize-template" && !currentSelectedTemplate && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <p className="font-medium">Select template to customize:</p>
                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {workoutTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            setCurrentSelectedTemplate(template.id)
                            handleLoadTemplateForCustomization(template.id)
                          }}
                          className="p-3 rounded-lg border-2 border-border bg-background hover:border-[#E8FF00] transition-all text-left"
                        >
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{template.exercises.length} exercises</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customize Template Form */}
                {currentDay && currentWorkoutMode === "customize-template" && currentSelectedTemplate && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="customName">Workout Name *</Label>
                        <Input 
                          id="customName"
                          placeholder="e.g., Modified Chest Builder"
                          value={customWorkoutForm.name}
                          onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, name: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customDesc">Description</Label>
                        <Textarea 
                          id="customDesc"
                          placeholder="Describe the customized workout"
                          rows={2}
                          value={customWorkoutForm.description}
                          onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, description: e.target.value})}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Exercises</p>
                          <button
                            onClick={handleAddCustomExercise}
                            className="text-xs bg-[#E8FF00] text-black px-2 py-1 rounded hover:bg-[#E8FF00]/80"
                          >
                            + Add Exercise
                          </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {customExercises.map((ex, idx) => (
                            <div key={idx} className="flex gap-2">
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

                {/* Create Custom Workout */}
                {currentDay && currentWorkoutMode === "create-custom" && (
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
                          <p className="font-medium">Add Exercises</p>
                          <button
                            onClick={handleAddCustomExercise}
                            className="text-xs bg-[#E8FF00] text-black px-2 py-1 rounded hover:bg-[#E8FF00]/80"
                          >
                            + Add Exercise
                          </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {customExercises.map((ex, idx) => (
                            <div key={idx} className="flex gap-2">
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

                {/* Assign for This Day / Add Another Day */}
                {currentDay && currentWorkoutMode && (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAssignWorkoutForDay}
                      disabled={!currentDayStartDate || !currentDayEndDate}
                      className="flex-1 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Assign for Day {String(currentDay).padStart(2, "0")}
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentDay(null)
                        setCurrentWorkoutMode(null)
                        setCurrentSelectedTemplate(null)
                        setCurrentDayStartDate("")
                        setCurrentDayEndDate("")
                        setCustomWorkoutForm({ name: "", description: "" })
                        setCustomExercises([{ name: "", reps: "" }])
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
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
