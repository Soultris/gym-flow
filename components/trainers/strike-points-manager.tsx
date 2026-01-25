"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Loader2, X } from "lucide-react"
import { useState } from "react"
import { useUpdateStrikePointsMutation } from "@/store/api/trainersApi"
import toast from "react-hot-toast"

interface StrikePointsManagerProps {
  trainerId: number;
  currentStrikePoints: number;
  trainerName: string;
}

export function StrikePointsManager({
  trainerId,
  currentStrikePoints,
  trainerName,
}: StrikePointsManagerProps) {
  const [strikePoints, setStrikePoints] = useState(currentStrikePoints.toString())
  const [isEditing, setIsEditing] = useState(false)
  const [updateStrikePoints, { isLoading }] = useUpdateStrikePointsMutation()

  const handleSave = async () => {
    const points = parseInt(strikePoints, 10)

    if (isNaN(points) || points < 0) {
      toast.error("Strike points must be a valid non-negative number")
      return
    }

    try {
      await updateStrikePoints({
        id: trainerId,
        strikePoints: points,
      }).unwrap()

      toast.success(`Strike points updated to ${points}`)
      setIsEditing(false)
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message ||
            "Failed to update strike points"
          : "Failed to update strike points"
      toast.error(errorMessage)
    }
  }

  const handleCancel = () => {
    setStrikePoints(currentStrikePoints.toString())
    setIsEditing(false)
  }

  const handleAddStrike = async () => {
    const newPoints = currentStrikePoints + 1
    try {
      await updateStrikePoints({
        id: trainerId,
        strikePoints: newPoints,
      }).unwrap()

      toast.success(`Strike added! ${trainerName} now has ${newPoints} strike(s)`)
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message ||
            "Failed to add strike"
          : "Failed to add strike"
      toast.error(errorMessage)
    }
  }

  const getStrikeLevel = (points: number) => {
    if (points === 0) return "safe"
    if (points === 1) return "warning"
    if (points === 2) return "danger"
    return "critical"
  }

  const getStrikeLevelColor = (level: string) => {
    switch (level) {
      case "safe":
        return "bg-green-500/20 text-green-700"
      case "warning":
        return "bg-yellow-500/20 text-yellow-700"
      case "danger":
        return "bg-orange-500/20 text-orange-700"
      case "critical":
        return "bg-red-500/20 text-red-700"
      default:
        return "bg-gray-500/20 text-gray-700"
    }
  }

  const strikeLevel = getStrikeLevel(currentStrikePoints)
  const levelColor = getStrikeLevelColor(strikeLevel)

  return (
    <Card className="p-6 space-y-4 border-border bg-secondary/30">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold">Strike Points System</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Manually adjust trainer strike points for disciplinary action
          </p>
        </div>
      </div>

      {/* Strike Points Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Points */}
        <div className="space-y-2">
          <Label>Current Strike Points</Label>
          <div className={`p-4 rounded-lg ${levelColor} border border-current/20 text-center`}>
            <p className="text-4xl font-bold">{currentStrikePoints}</p>
            <p className="text-sm mt-2 capitalize">
              {strikeLevel === "safe"
                ? "No strikes"
                : strikeLevel === "warning"
                  ? "1 strike received"
                  : strikeLevel === "danger"
                    ? "2 strikes - Warning"
                    : "3+ strikes - Critical"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 flex flex-col justify-between">
          <Label>Quick Actions</Label>
          <div className="space-y-2">
            <Button
              onClick={handleAddStrike}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Add 1 Strike
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Mode */}
      {!isEditing ? (
        <div>
          <Button
            variant="outline"
            className="w-full border-border hover:bg-secondary"
            onClick={() => setIsEditing(true)}
          >
            Manually Set Strike Points
          </Button>
        </div>
      ) : (
        <div className="space-y-3 p-4 rounded-lg bg-secondary border border-border">
          <div className="space-y-2">
            <Label htmlFor="strikePointsInput">Set Strike Points</Label>
            <Input
              id="strikePointsInput"
              type="number"
              min="0"
              value={strikePoints}
              onChange={(e) => setStrikePoints(e.target.value)}
              className="bg-background border-border"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
              className="flex-1 border-border"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
