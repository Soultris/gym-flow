"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGetGymProfileQuery, useUpdateGymProfileMutation } from "@/store/api/gymApi"
import { toast } from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"

export function DeviceSettingsForm() {
  const { data: gymProfile, isLoading, isError } = useGetGymProfileQuery()
  const [updateGym, { isLoading: isUpdating }] = useUpdateGymProfileMutation()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [serial, setSerial] = useState("")

  useEffect(() => {
    if (gymProfile) {
      setUsername(prev => gymProfile.fingerprintUsername !== null ? gymProfile.fingerprintUsername : prev)
      setPassword(prev => gymProfile.fingerprintPassword !== null ? gymProfile.fingerprintPassword : prev)
      setSerial(prev => gymProfile.terminalSerial !== null ? gymProfile.terminalSerial : prev)
    }
  }, [gymProfile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!gymProfile) {
      toast.error("Gym profile not loaded. Please refresh the page.")
      return;
    }

    try {
      const fd = new FormData()
      fd.append("name", gymProfile.name || "")
      fd.append("address", gymProfile.address || "")
      fd.append("phone", gymProfile.phone || "")
      fd.append("fingerprintUsername", username)
      fd.append("fingerprintPassword", password)
      fd.append("terminalSerial", serial)

      await updateGym(fd).unwrap()
      
      toast.success("Device settings updated successfully")
    } catch (error) {
      console.error("Failed to update settings", error)
      toast.error(getErrorMessage(error, "Failed to update settings"))
    }
  }

  if (isLoading) {
    return <div>Loading settings...</div>
  }

  if (isError || !gymProfile) {
     return <div className="text-red-500">Failed to load device settings. Please try refreshing the page.</div>
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Device Configuration</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Configure the credentials for your fingerprint attendance device. These credentials will be used to upload member data when they are approved.
      </p>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="terminalSerial">Terminal Serial Number</Label>
            <Input 
              id="terminalSerial" 
              value={serial} 
              onChange={(e) => setSerial(e.target.value)} 
              placeholder="e.g. VGU6254800148"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">API Username</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="API Username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">API Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="API Password"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isUpdating}
        >
          {isUpdating ? "Saving..." : "Save Configuration"}
        </Button>
      </form>
    </Card>
  )
}
