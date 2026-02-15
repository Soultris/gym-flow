"use client"

import { useState, useEffect } from "react"
import { useGetGymProfileQuery, useUpdateGymProfileMutation, useAddTerminalMutation, useDeleteTerminalMutation } from "@/store/api/gymApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table" // Removed as component doesn't exist
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { getErrorMessage } from "@/lib/errorUtils"

export function DeviceSettingsForm() {
  const { data: gymProfile, isLoading, isError } = useGetGymProfileQuery()
  const [updateGym, { isLoading: isUpdating }] = useUpdateGymProfileMutation()
  const [addTerminal, { isLoading: isAdding }] = useAddTerminalMutation()
  const [deleteTerminal, { isLoading: isDeleting }] = useDeleteTerminalMutation()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  // Add Terminal State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTerminalSerial, setNewTerminalSerial] = useState("")
  const [newTerminalName, setNewTerminalName] = useState("")

  useEffect(() => {
    if (gymProfile) {
      setTimeout(() => {
        setUsername(gymProfile.fingerprintUsername || "")
        setPassword(gymProfile.fingerprintPassword || "")
      }, 0)
    }
  }, [gymProfile])

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gymProfile) return;

    try {
      // Create a FormData object to mimic what updateGymProfile expects (since it handles file uploads too)
      // Actually, looking at gymApi, updateGymProfile takes FormData.
      // But we can construct it.
      const formData = new FormData();
      formData.append('name', gymProfile.name); // Required fields
      formData.append('subdomain', gymProfile.subdomain);
      
      // Append credentials
      formData.append('fingerprintUsername', username);
      formData.append('fingerprintPassword', password);

      // We might need to handle other fields to avoid overwriting them with profile data?
      // Ideally updateGymProfile should be partial, but the controller expects all fields or uses defaults?
      // Based on controller, it extracts fields. If undefined, it might update to null/undefined or ignore.
      // Re-reading controller: `const { name ... } = req.body`. `updateData = { name ... }`.
      // If `name` is undefined in body, `updateData.name` is undefined. Prisma ignores undefined in update?
      // No, `req.body` usually has JSON, but `upload.single` makes it FormData.
      // If we use `useUpdateGymProfileMutation` which sends FormData, we must be careful.
      // Let's just send what we changed plus required identifiers if needed.
      // The controller implementation: finds gym by `req.user.gymId`. `data: updateData`.
      // If we only send credentials, other fields in `updateData` will be undefined.
      // `prisma.gym.update` with undefined fields will NOT update them (except if explicitly set to null).
      // So sending only credentials should be safe provided backend handles partial updates.
      // However, `name` and `subdomain` are required in schema? No, only in create. In update `where` is used.
      // Let's try sending just credentials.

      await updateGym(formData).unwrap()
      toast.success("API Credentials updated successfully")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleAddTerminal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        await addTerminal({ serial: newTerminalSerial, name: newTerminalName }).unwrap()
        toast.success("Terminal added successfully")
        setIsAddDialogOpen(false)
        setNewTerminalSerial("")
        setNewTerminalName("")
    } catch (err) {
        toast.error(getErrorMessage(err))
    }
  }

  const handleDeleteTerminal = async (terminalId: string) => {
      if(!confirm("Are you sure you want to delete this terminal?")) return;
      try {
          await deleteTerminal(terminalId).unwrap()
          toast.success("Terminal deleted successfully")
      } catch (err) {
          toast.error(getErrorMessage(err))
      }
  }

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
  if (isError) return <div className="text-red-500 p-8">Failed to load device settings</div>

  // Check if credentials are set to enable Add Terminal
  const areCredentialsSet = !!(gymProfile?.fingerprintUsername && gymProfile?.fingerprintPassword);

  return (
    <div className="space-y-6">
      {/* API Credentials Section */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure your biometric device API credentials. These are required before adding terminals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateCredentials} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">API Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter API Username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">API Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter API Password"
                />
              </div>
            </div>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Credentials
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Terminals List Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Terminals</CardTitle>
            <CardDescription>
              Manage your connected biometric terminals.
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!areCredentialsSet} title={!areCredentialsSet ? "Save API credentials first" : ""}>
                <Plus className="mr-2 h-4 w-4" />
                Add Terminal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Terminal</DialogTitle>
                <DialogDescription>
                  Enter the serial number and a name for the new terminal.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTerminal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="terminalName">Terminal Name</Label>
                  <Input
                    id="terminalName"
                    value={newTerminalName}
                    onChange={(e) => setNewTerminalName(e.target.value)}
                    placeholder="e.g. Main Entrance"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terminalSerial">Serial Number</Label>
                  <Input
                    id="terminalSerial"
                    value={newTerminalSerial}
                    onChange={(e) => setNewTerminalSerial(e.target.value)}
                    placeholder="Enter Serial Number"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isAdding}>
                    {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Add Terminal
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Serial Number</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gymProfile?.terminals && gymProfile.terminals.length > 0 ? (
                    gymProfile.terminals.map((terminal) => (
                      <tr key={terminal.terminalId} className="bg-background border-b hover:bg-muted/50">
                        <td className="px-6 py-4 font-medium">{terminal.name}</td>
                        <td className="px-6 py-4">{terminal.serial}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteTerminal(terminal.terminalId)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">
                        No terminals connected. Add a terminal to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
