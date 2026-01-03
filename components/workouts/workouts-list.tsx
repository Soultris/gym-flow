"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Check } from "lucide-react"
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
import { useState } from "react"

const workouts = [
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
    id: 3,
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
    id: 4,
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
]

type DialogType = "add-plan" | "edit-plan" | null

export function WorkoutsList() {
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null)
  const [exercises, setExercises] = useState<Array<{ name: string; reps: string }>>([
    { name: "", reps: "" }
  ])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const selectedWorkout = selectedWorkoutId ? workouts.find(w => w.id === selectedWorkoutId) : null

  const addExerciseField = () => {
    setExercises([...exercises, { name: "", reps: "" }])
  }

  const removeExerciseField = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleEditClick = (workoutId: number) => {
    setSelectedWorkoutId(workoutId)
    const workout = workouts.find(w => w.id === workoutId)
    if (workout) {
      setFormData({
        ...formData,
        name: workout.name,
        description: workout.description,

      })
      setExercises(workout.exercises.map(e => ({ ...e })))
      setDialogType("edit-plan")
    }
  }

  const handleDeleteClick = (workoutId: number) => {
    setSelectedWorkoutId(workoutId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false)
    setSelectedWorkoutId(null)
  }

  const closeDialog = () => {
    setDialogType(null)
    setSelectedWorkoutId(null)
    setFormData({
      name: "",
      description: "",
    })
    setExercises([{ name: "", reps: "" }])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogType === "add-plan"} onOpenChange={(open) => {
          if (!open) closeDialog()
          else setDialogType("add-plan")
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80">
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create Workout Plan</DialogTitle>
              <DialogDescription>Add a new workout plan with exercises and reps</DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="addWorkoutName">Workout Plan Name *</Label>
                <Input 
                  id="addWorkoutName" 
                  placeholder="e.g., Chest Builder" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addWorkoutDescription">Description</Label>
                <Textarea 
                  id="addWorkoutDescription" 
                  placeholder="Describe the workout plan" 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                <Button type="submit" className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80">
                  Create Workout
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Workout Plan Dialog */}
      <Dialog open={dialogType === "edit-plan"} onOpenChange={(open) => {
        if (!open) closeDialog()
      }}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Workout Plan</DialogTitle>
            <DialogDescription>Update the workout plan details and exercises</DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editWorkoutName">Workout Plan Name *</Label>
              <Input 
                id="editWorkoutName" 
                placeholder="e.g., Chest Builder" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editWorkoutDescription">Description</Label>
              <Textarea 
                id="editWorkoutDescription" 
                placeholder="Describe the workout plan" 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              <Button type="submit" className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80">
                Update Workout
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workout plan? This action cannot be undone.
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {workouts.map((workout) => (
          <Card 
            key={workout.id} 
            className="p-5 transition-all hover:border-[#E8FF00]/50"
          >
            <div className="mb-3">
              <h3 className="text-base font-semibold">{workout.name}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{workout.description}</p>
            </div>

            <div className="mb-4 space-y-2">
              {workout.exercises.map((exercise, idx) => (
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
                onClick={() => handleEditClick(workout.id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteClick(workout.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
