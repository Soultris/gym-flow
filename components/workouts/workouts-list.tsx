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
import { useState, useMemo } from "react"

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
  const handleAssignWorkouts = () => {
    if (!selectedMemberId) return

    const selectedMember = mockMembers.find(m => m.id === selectedMemberId)
    if (!selectedMember) return

    let newAssignments: AssignedWorkout[] = []

    if (workoutCreationMode === "select") {
      // Use existing templates directly
      if (selectedWorkoutIds.size === 0) return
      newAssignments = Array.from(selectedWorkoutIds.entries()).map(([workoutId, dates]) => {
        const template = workoutTemplates.find(t => t.id === workoutId)
        return {
          id: `assigned-${Date.now()}-${workoutId}`,
          memberId: selectedMemberId,
          memberName: selectedMember.name,
          workoutId,
          workoutName: template?.name || "",
          startDate: dates.startDate,
          endDate: dates.endDate,
          assignedDate: new Date().toISOString().split('T')[0],
          notificationSent: false,
          notificationType,
        }
      })
    } else if (workoutCreationMode === "customize-template") {
      // Customize template before assigning
      if (!customWorkoutForm.name.trim()) return
      
      const customizedWorkout: AssignedWorkout = {
        id: `assigned-${Date.now()}-custom`,
        memberId: selectedMemberId,
        memberName: selectedMember.name,
        workoutId: selectedTemplateForCustomization || 0,
        workoutName: customWorkoutForm.name,
        startDate: selectedWorkoutIds.get(selectedTemplateForCustomization || 0)?.startDate || new Date().toISOString().split('T')[0],
        endDate: selectedWorkoutIds.get(selectedTemplateForCustomization || 0)?.endDate || new Date().toISOString().split('T')[0],
        assignedDate: new Date().toISOString().split('T')[0],
        notificationSent: false,
        notificationType,
      }
      newAssignments = [customizedWorkout]
    } else if (workoutCreationMode === "create-custom") {
      // Create fully custom workout
      if (!customWorkoutForm.name.trim()) return
      
      const customWorkout: AssignedWorkout = {
        id: `assigned-${Date.now()}-fully-custom`,
        memberId: selectedMemberId,
        memberName: selectedMember.name,
        workoutId: -1, // Use -1 to indicate fully custom
        workoutName: customWorkoutForm.name,
        startDate: selectedWorkoutIds.get(0)?.startDate || new Date().toISOString().split('T')[0],
        endDate: selectedWorkoutIds.get(0)?.endDate || new Date().toISOString().split('T')[0],
        assignedDate: new Date().toISOString().split('T')[0],
        notificationSent: false,
        notificationType,
      }
      newAssignments = [customWorkout]
    }

    setAssignedWorkouts([...assignedWorkouts, ...newAssignments])
    
    // Reset all forms
    setMemberSearch("")
    setSelectedMemberId(null)
    setSelectedWorkoutIds(new Map())
    handleResetCustomWorkout()
    setWorkoutCreationMode("select")
    closeDialog()
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
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="templates">Workout Templates</TabsTrigger>
          <TabsTrigger value="assign">Assign to Members</TabsTrigger>
        </TabsList>

        {/* Workout Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
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
        </TabsContent>

        {/* Assign to Members Tab */}
        <TabsContent value="assign" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Assign Workouts to Members</h3>
            
            {/* Member Search */}
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="memberSearch">Search Member</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="memberSearch"
                    placeholder="Search by name or ID..." 
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
                      }}
                      className="w-full p-3 text-left hover:bg-muted border-b last:border-b-0 transition-colors"
                    >
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.id} • {member.phone}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedMemberId && (
                <div className="p-3 bg-accent/10 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {mockMembers.find(m => m.id === selectedMemberId)?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedMemberId}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedMemberId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Workout Selection */}
            {selectedMemberId && (
              <div className="space-y-6 mb-6">
                {/* Workout Creation Mode Selection */}
                <div className="space-y-3">
                  <Label>How would you like to create the workout?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setWorkoutCreationMode("select")
                        setSelectedWorkoutIds(new Map())
                        handleResetCustomWorkout()
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        workoutCreationMode === "select"
                          ? "border-[#E8FF00] bg-[#E8FF00]/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div className="font-semibold mb-1">Use Template</div>
                      <div className="text-sm text-muted-foreground">Select an existing template and assign directly</div>
                    </button>
                    <button
                      onClick={() => {
                        setWorkoutCreationMode("customize-template")
                        setSelectedWorkoutIds(new Map())
                        handleResetCustomWorkout()
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        workoutCreationMode === "customize-template"
                          ? "border-[#E8FF00] bg-[#E8FF00]/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div className="font-semibold mb-1">Customize Template</div>
                      <div className="text-sm text-muted-foreground">Start with a template and edit it before assigning</div>
                    </button>
                    <button
                      onClick={() => {
                        setWorkoutCreationMode("create-custom")
                        setSelectedWorkoutIds(new Map())
                        handleResetCustomWorkout()
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        workoutCreationMode === "create-custom"
                          ? "border-[#E8FF00] bg-[#E8FF00]/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div className="font-semibold mb-1">Create Custom</div>
                      <div className="text-sm text-muted-foreground">Build a completely custom workout from scratch</div>
                    </button>
                  </div>
                </div>

                {/* Mode-Specific Content */}
                {workoutCreationMode === "select" && (
                  <div className="space-y-4">
                    <Label>Select Workouts & Date Ranges</Label>
                    <div className="space-y-3">
                      {workoutTemplates.map((template) => (
                        <div key={template.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`workout-${template.id}`}
                              checked={selectedWorkoutIds.has(template.id)}
                              onChange={(e) => {
                                const newMap = new Map(selectedWorkoutIds)
                                if (e.target.checked) {
                                  newMap.set(template.id, { startDate: "", endDate: "" })
                                } else {
                                  newMap.delete(template.id)
                                }
                                setSelectedWorkoutIds(newMap)
                              }}
                              className="w-4 h-4"
                            />
                            <label htmlFor={`workout-${template.id}`} className="flex-1 cursor-pointer">
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-muted-foreground">{template.description}</div>
                            </label>
                          </div>

                          {selectedWorkoutIds.has(template.id) && (
                            <div className="grid grid-cols-2 gap-3 ml-6">
                              <div className="space-y-2">
                                <Label htmlFor={`start-${template.id}`} className="text-sm">Start Date</Label>
                                <Input
                                  id={`start-${template.id}`}
                                  type="date"
                                  value={selectedWorkoutIds.get(template.id)?.startDate || ""}
                                  onChange={(e) => {
                                    const newMap = new Map(selectedWorkoutIds)
                                    const current = newMap.get(template.id) || { startDate: "", endDate: "" }
                                    newMap.set(template.id, { ...current, startDate: e.target.value })
                                    setSelectedWorkoutIds(newMap)
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`end-${template.id}`} className="text-sm">End Date</Label>
                                <Input
                                  id={`end-${template.id}`}
                                  type="date"
                                  value={selectedWorkoutIds.get(template.id)?.endDate || ""}
                                  onChange={(e) => {
                                    const newMap = new Map(selectedWorkoutIds)
                                    const current = newMap.get(template.id) || { startDate: "", endDate: "" }
                                    newMap.set(template.id, { ...current, endDate: e.target.value })
                                    setSelectedWorkoutIds(newMap)
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {workoutCreationMode === "customize-template" && (
                  <div className="space-y-4">
                    {!selectedTemplateForCustomization ? (
                      <div className="space-y-3">
                        <Label>Select a Template to Customize</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {workoutTemplates.map((template) => (
                            <div
                              key={template.id}
                              onClick={() => handleLoadTemplateForCustomization(template.id)}
                              className="border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors"
                            >
                              <div className="font-medium mb-2">{template.name}</div>
                              <div className="text-sm text-muted-foreground mb-3">{template.description}</div>
                              <div className="text-xs space-y-1">
                                {template.exercises.slice(0, 3).map((ex, idx) => (
                                  <div key={idx} className="text-muted-foreground">• {ex.name} ({ex.reps})</div>
                                ))}
                                {template.exercises.length > 3 && <div className="text-muted-foreground">• +{template.exercises.length - 3} more</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">Customize Template</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleResetCustomWorkout}
                          >
                            Choose Different Template
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="custom-name">Workout Name</Label>
                          <Input
                            id="custom-name"
                            value={customWorkoutForm.name}
                            onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, name: e.target.value})}
                            placeholder="Enter workout name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="custom-desc">Description</Label>
                          <Textarea
                            id="custom-desc"
                            value={customWorkoutForm.description}
                            onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, description: e.target.value})}
                            placeholder="Enter workout description"
                            className="min-h-20"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Exercises & Reps</Label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleAddCustomExercise}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Exercise
                            </Button>
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {customExercises.map((exercise, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="Exercise name"
                                  className="flex-1"
                                  value={exercise.name}
                                  onChange={(e) => handleUpdateCustomExercise(index, "name", e.target.value)}
                                />
                                <Input
                                  placeholder="e.g., 12 x 4"
                                  className="w-24"
                                  value={exercise.reps}
                                  onChange={(e) => handleUpdateCustomExercise(index, "reps", e.target.value)}
                                />
                                {customExercises.length > 1 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive"
                                    onClick={() => handleRemoveCustomExercise(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Date Range</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="custom-start" className="text-sm">Start Date</Label>
                              <Input
                                id="custom-start"
                                type="date"
                                value={selectedWorkoutIds.get(0)?.startDate || ""}
                                onChange={(e) => {
                                  const newMap = new Map(selectedWorkoutIds)
                                  const current = newMap.get(0) || { startDate: "", endDate: "" }
                                  newMap.set(0, { ...current, startDate: e.target.value })
                                  setSelectedWorkoutIds(newMap)
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor="custom-end" className="text-sm">End Date</Label>
                              <Input
                                id="custom-end"
                                type="date"
                                value={selectedWorkoutIds.get(0)?.endDate || ""}
                                onChange={(e) => {
                                  const newMap = new Map(selectedWorkoutIds)
                                  const current = newMap.get(0) || { startDate: "", endDate: "" }
                                  newMap.set(0, { ...current, endDate: e.target.value })
                                  setSelectedWorkoutIds(newMap)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {workoutCreationMode === "create-custom" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Create Custom Workout</h4>

                    <div className="space-y-2">
                      <Label htmlFor="new-custom-name">Workout Name</Label>
                      <Input
                        id="new-custom-name"
                        value={customWorkoutForm.name}
                        onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, name: e.target.value})}
                        placeholder="Enter workout name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-custom-desc">Description</Label>
                      <Textarea
                        id="new-custom-desc"
                        value={customWorkoutForm.description}
                        onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, description: e.target.value})}
                        placeholder="Enter workout description"
                        className="min-h-20"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Exercises & Reps</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleAddCustomExercise}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Exercise
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {customExercises.map((exercise, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Exercise name"
                              className="flex-1"
                              value={exercise.name}
                              onChange={(e) => handleUpdateCustomExercise(index, "name", e.target.value)}
                            />
                            <Input
                              placeholder="e.g., 12 x 4"
                              className="w-24"
                              value={exercise.reps}
                              onChange={(e) => handleUpdateCustomExercise(index, "reps", e.target.value)}
                            />
                            {customExercises.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="text-destructive"
                                onClick={() => handleRemoveCustomExercise(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="new-custom-start" className="text-sm">Start Date</Label>
                          <Input
                            id="new-custom-start"
                            type="date"
                            value={selectedWorkoutIds.get(0)?.startDate || ""}
                            onChange={(e) => {
                              const newMap = new Map(selectedWorkoutIds)
                              const current = newMap.get(0) || { startDate: "", endDate: "" }
                              newMap.set(0, { ...current, startDate: e.target.value })
                              setSelectedWorkoutIds(newMap)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-custom-end" className="text-sm">End Date</Label>
                          <Input
                            id="new-custom-end"
                            type="date"
                            value={selectedWorkoutIds.get(0)?.endDate || ""}
                            onChange={(e) => {
                              const newMap = new Map(selectedWorkoutIds)
                              const current = newMap.get(0) || { startDate: "", endDate: "" }
                              newMap.set(0, { ...current, endDate: e.target.value })
                              setSelectedWorkoutIds(newMap)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notification Type */}
            {selectedMemberId && (
              <div className={`space-y-4 mb-6 pb-6 border-b ${
                (workoutCreationMode === "select" && selectedWorkoutIds.size === 0) ||
                (workoutCreationMode !== "select" && !customWorkoutForm.name.trim())
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}>
                <Label>Notify Member Via</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="notification"
                      value="sms"
                      checked={notificationType === "sms"}
                      onChange={(e) => setNotificationType(e.target.value as "sms")}
                      className="w-4 h-4"
                    />
                    <Send className="h-4 w-4" />
                    SMS
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="notification"
                      value="email"
                      checked={notificationType === "email"}
                      onChange={(e) => setNotificationType(e.target.value as "email")}
                      className="w-4 h-4"
                    />
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="notification"
                      value="both"
                      checked={notificationType === "both"}
                      onChange={(e) => setNotificationType(e.target.value as "both")}
                      className="w-4 h-4"
                    />
                    <span>Both</span>
                  </label>
                </div>
              </div>
            )}

            {/* Assign Button */}
            <Button 
              className="w-full bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
              disabled={
                !selectedMemberId || 
                (workoutCreationMode === "select" && selectedWorkoutIds.size === 0) ||
                (workoutCreationMode !== "select" && !customWorkoutForm.name.trim())
              }
              onClick={handleAssignWorkouts}
            >
              <Plus className="h-4 w-4 mr-2" />
              Assign Workout
            </Button>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
