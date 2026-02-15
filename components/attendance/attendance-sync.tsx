"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useSyncAttendanceMutation } from "@/store/api/attendanceApi"
import { RefreshCw } from "lucide-react"
import { toast } from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"

function formatTimeAgo(date: Date) {
  const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

export function AttendanceSync() {
  const [syncAttendance, { isLoading }] = useSyncAttendanceMutation()
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  
  // Use a state to trigger re-renders for time updates every minute if needed, 
  // or just rely on new syncs. For now, simple static display is fine.
  
  const handleSync = useCallback(async (silent: boolean = false) => {
    try {
      const result = await syncAttendance().unwrap()
      setLastSynced(new Date())
      
      if (!silent) {
        toast.success(result.message || "Attendance synced successfully")
      } else if (result.syncedCount > 0) {
        toast.success(`Auto-sync: ${result.syncedCount} new records found`)
      }
    } catch (error) {
       // Only show error for manual syncs to avoid annoyances
      console.error("Failed to sync attendance", error)
      if (!silent) {
        toast.error(getErrorMessage(error, "Failed to sync attendance"))
      }
    }
  }, [syncAttendance])

  const onManualSync = () => {
    if (isLoading) return;
    handleSync(false);
  }

  // Initial sync on mount and then every 30 minutes
  useEffect(() => {
    // Perform initial sync (wrapped in setTimeout to avoid synchronous state update warning)
    const initialSyncTimer = setTimeout(() => {
      handleSync(true);
    }, 0);

    const interval = setInterval(() => {
      handleSync(true);
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      clearTimeout(initialSyncTimer);
      clearInterval(interval);
    }
  }, [handleSync]);

  return (
    <div className="flex items-center gap-4">
      {lastSynced && (
        <span className="text-sm text-muted-foreground hidden sm:inline-block">
          Last fetched {formatTimeAgo(lastSynced)}
        </span>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onManualSync}
        disabled={isLoading}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Syncing..." : "Sync Now"}
      </Button>
    </div>
  )
}
