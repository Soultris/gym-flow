"use client"

import { 
    useGetGymByIdQuery, 
    useToggleFeatureMutation, 
    useUpdateGymMutation, 
    useCreateGymAdminMutation,
    useAddGymTerminalMutation,
    useDeleteGymTerminalMutation,
    useRemoveGymAdminMutation,
    useResetGymAdminPasswordMutation,
    useGetGymSmsBalanceQuery
} from "@/store/api/adminApi" 

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash, Key, MoreVertical, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/ui/image-upload"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const AVAILABLE_FEATURES = [
  { code: 'BULK_SMS', name: 'Bulk SMS', description: 'Enable SMS marketing and notifications' },
  { code: 'INVENTORY', name: 'Inventory Management', description: 'Track products and stock levels' },
  { code: 'DIRECT_MEMBER_CREATION', name: 'Direct Member Creation', description: 'Allow adding members directly without QR scan.' },
]

export default function GymDetailsPage() {
  const params = useParams()
  const gymId = parseInt(params.id as string)
  const { data: gym, isLoading } = useGetGymByIdQuery(gymId)
  


  const [toggleFeature] = useToggleFeatureMutation()
  const [updateGym, { isLoading: isUpdating }] = useUpdateGymMutation()
  const [createAdmin, { isLoading: isCreatingAdmin }] = useCreateGymAdminMutation()

  const [isEditing, setIsEditing] = useState(false)
  // Form States
  const [editForm, setEditForm] = useState<{
      name: string; 
      subdomain: string;
      smsEmail?: string | null;
      smsSenderId?: string | null;
      smsApiKey?: string | null;
      fingerprintUsername?: string | null;
      fingerprintPassword?: string | null;
  }>({ 
      name: "", 
      subdomain: "",
      smsEmail: "",
      smsSenderId: "",
      smsApiKey: "",
      fingerprintUsername: "",
      fingerprintPassword: ""
  });
  const [logoFile, setLogoFile] = useState<File | string | null>(null)
  const [removeLogo, setRemoveLogo] = useState(false)
  
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false)
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" })

  const [isTerminalDialogOpen, setIsTerminalDialogOpen] = useState(false)
  const [terminalForm, setTerminalForm] = useState({ serial: "", name: "", alias: "" })

  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [resetPasswordForm, setResetPasswordForm] = useState({ userId: 0, password: "" })

  const { data: smsBalance } = useGetGymSmsBalanceQuery(gymId)
  
  const [addTerminal, { isLoading: isAddingTerminal }] = useAddGymTerminalMutation()
  const [deleteTerminal] = useDeleteGymTerminalMutation()
  const [removeAdmin] = useRemoveGymAdminMutation()
  const [resetPassword, { isLoading: isResettingPassword }] = useResetGymAdminPasswordMutation()

  const startEditing = () => {
      if (gym) {
          setEditForm({ 
              name: gym.name, 
              subdomain: gym.subdomain || "",
              smsEmail: gym.smsEmail,
              smsSenderId: gym.smsSenderId,
              smsApiKey: gym.smsApiKey,
              fingerprintUsername: gym.fingerprintUsername,
              fingerprintPassword: gym.fingerprintPassword
          });
          setLogoFile(gym.logoUrl || null)
          setRemoveLogo(false)
          setIsEditing(true)
      }
  }

  const handleUpdateGym = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append("name", editForm.name)
      fd.append("subdomain", editForm.subdomain)
      if (editForm.smsEmail) fd.append("smsEmail", editForm.smsEmail)
      if (editForm.smsSenderId) fd.append("smsSenderId", editForm.smsSenderId)
      if (editForm.smsApiKey) fd.append("smsApiKey", editForm.smsApiKey)
      
      // Add Terminal Credentials
      if (editForm.fingerprintUsername) fd.append("fingerprintUsername", editForm.fingerprintUsername)
      if (editForm.fingerprintPassword) fd.append("fingerprintPassword", editForm.fingerprintPassword)

      if (logoFile instanceof File) {
        fd.append("logo", logoFile)
      } else if (removeLogo) {
        fd.append("removeLogo", "true")
      }
      await updateGym({ id: gymId, data: fd }).unwrap()
      toast.success("Gym updated successfully")
      setIsEditing(false)
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update gym"))
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAdmin({ gymId, data: adminForm }).unwrap()
      toast.success("Admin created successfully")
      setIsAdminDialogOpen(false)
      setAdminForm({ name: "", email: "", password: "" })
    } catch (error) {
        toast.error(getErrorMessage(error, "Failed to create admin"))
    }
  }

  const handleAddTerminal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addTerminal({ gymId, data: terminalForm }).unwrap()
      toast.success("Terminal added successfully")
      setIsTerminalDialogOpen(false)
      setTerminalForm({ serial: "", name: "", alias: "" })
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add terminal"))
    }
  }

  const handleDeleteTerminal = async (terminalId: string) => {
    if (!confirm("Are you sure you want to delete this terminal?")) return;
    try {
      await deleteTerminal({ gymId, terminalId }).unwrap()
      toast.success("Terminal deleted successfully")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete terminal"))
    }
  }

  const handleRemoveAdmin = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this admin? This action cannot be undone.")) return;
    try {
      await removeAdmin({ gymId, userId }).unwrap()
      toast.success("Admin removed successfully")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to remove admin"))
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await resetPassword({ gymId, userId: resetPasswordForm.userId, password: resetPasswordForm.password }).unwrap()
      toast.success("Password reset successfully")
      setIsResetPasswordDialogOpen(false)
      setResetPasswordForm({ userId: 0, password: "" })
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to reset password"))
    }
  }

  const handleToggleFeature = async (featureCode: string, enabled: boolean) => {
    try {
      await toggleFeature({ gymId, featureCode, enabled }).unwrap()
      toast.success(`Feature ${enabled ? 'enabled' : 'disabled'} successfully`)
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update feature"))
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Loading gym details...</div>
      </DashboardLayout>
    )
  }

  if (!gym) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Gym not found</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full p-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/gyms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{gym.name}</h1>
            <p className="text-muted-foreground">{gym.subdomain ? `${gym.subdomain}.soultris.com` : 'No subdomain'}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Gym Details Card (Editable) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Gym Details</CardTitle>
              {!isEditing && (
                  <Button variant="outline" size="sm" onClick={startEditing}>Edit</Button>
              )}
            </CardHeader>
            <CardContent className="pt-4">
                {isEditing ? (
                    <form onSubmit={handleUpdateGym} className="space-y-4">
                        <div className="flex flex-col items-center justify-center mb-6 gap-2">
                            <AvatarUpload
                                value={logoFile}
                                onChange={(file) => {
                                    setLogoFile(file)
                                    setRemoveLogo(false)
                                }}
                            />
                            {logoFile && (
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => {
                                        setLogoFile(null)
                                        setRemoveLogo(true)
                                    }}
                                    className="text-red-500 hover:text-red-700 h-auto py-1 px-2 text-xs"
                                >
                                    Remove Logo
                                </Button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gymName">Gym Name</Label>
                            <Input 
                                id="gymName" 
                                value={editForm.name} 
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gymSubdomain">Subdomain</Label>
                            <Input 
                                id="gymSubdomain" 
                                value={editForm.subdomain} 
                                onChange={(e) => setEditForm({...editForm, subdomain: e.target.value})} 
                            />
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-lg font-medium mb-4">SMS Configuration</h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smsEmail">SMS Email</Label>
                                    <Input 
                                        id="smsEmail" 
                                        value={editForm.smsEmail || ""} 
                                        onChange={(e) => setEditForm({...editForm, smsEmail: e.target.value})} 
                                        placeholder="quicksend@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smsSenderId">Sender ID</Label>
                                    <Input 
                                        id="smsSenderId" 
                                        value={editForm.smsSenderId || ""} 
                                        onChange={(e) => setEditForm({...editForm, smsSenderId: e.target.value})} 
                                        placeholder="QKSend"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smsApiKey">API Key</Label>
                                    <Input 
                                        id="smsApiKey" 
                                        type="password"
                                        value={editForm.smsApiKey || ""} 
                                        onChange={(e) => setEditForm({...editForm, smsApiKey: e.target.value})} 
                                        placeholder="API Key"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-lg font-medium mb-4">Terminal Configuration</h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fingerprintUsername">API Username</Label>
                                    <Input 
                                        id="fingerprintUsername" 
                                        value={editForm.fingerprintUsername || ""} 
                                        onChange={(e) => setEditForm({...editForm, fingerprintUsername: e.target.value})} 
                                        placeholder="API Username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fingerprintPassword">API Password</Label>
                                    <Input 
                                        id="fingerprintPassword" 
                                        type="password"
                                        value={editForm.fingerprintPassword || ""} 
                                        onChange={(e) => setEditForm({...editForm, fingerprintPassword: e.target.value})} 
                                        placeholder="API Password"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="submit" disabled={isUpdating}>Save Changes</Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-center mb-6">
                            {gym.logoUrl ? (
                                <img src={gym.logoUrl} alt="Gym Logo" className="h-24 w-24 object-cover rounded-full border shadow-sm" />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border shadow-sm">
                                    <span className="text-3xl font-bold text-muted-foreground">
                                        {gym.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p className="text-lg">{gym.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Subdomain</p>
                            <p className="text-lg">{gym.subdomain || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">SMS Configuration</p>
                            <div className="grid grid-cols-2 gap-4 mt-2 p-4 border rounded bg-muted/50">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                                    <p className="text-sm">{gym.smsEmail || "Not configured"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Sender ID</p>
                                    <p className="text-sm">{gym.smsSenderId || "Not configured"}</p>
                                </div>
                                <div className="col-span-1">
                                    <p className="text-xs font-medium text-muted-foreground">API Key</p>
                                    <p className="text-sm font-mono">{gym.smsApiKey ? "••••••••" : "Not configured"}</p>
                                </div>
                                <div className="col-span-1">
                                    <p className="text-xs font-medium text-muted-foreground">Credits Balance</p>
                                    <p className="text-sm font-bold text-primary">
                                        {smsBalance ? `LKR ${smsBalance.balance}` : "Loading..."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Terminal Configuration</p>
                            <div className="grid grid-cols-2 gap-4 mt-2 p-4 border rounded bg-muted/50">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">API Username</p>
                                    <p className="text-sm">{gym.fingerprintUsername || "Not configured"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">API Password</p>
                                    <p className="text-sm font-mono">{gym.fingerprintPassword ? "••••••••" : "Not configured"}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground pt-2">
                            * Address and Phone fields have been hidden as per policy.
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>

          {/* Admin Users Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Admin Users</CardTitle>
              <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
                  <DialogTrigger asChild>
                      <Button size="sm">Add Admin</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                          <DialogTitle>Add New Admin User</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateAdmin} className="space-y-4">
                          <div className="space-y-2">
                              <Label htmlFor="adminName">Name</Label>
                              <Input 
                                  id="adminName" 
                                  value={adminForm.name} 
                                  onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                                  required
                              />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="adminEmail">Email</Label>
                              <Input 
                                  id="adminEmail" 
                                  type="email" 
                                  value={adminForm.email} 
                                  onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                                  required
                              />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="adminPassword">Password</Label>
                              <Input 
                                  id="adminPassword" 
                                  type="password" 
                                  value={adminForm.password} 
                                  onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                                  required
                              />
                          </div>
                          <Button type="submit" className="w-full" disabled={isCreatingAdmin}>Create Admin</Button>
                      </form>
                  </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="space-y-4">
                    {gym.users && gym.users.length > 0 ? (
                        gym.users.map(user => (
                            <div key={user.userId} className="flex items-center justify-between p-2 border rounded-lg">
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                        Admin
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {
                                                setResetPasswordForm({ userId: user.userId, password: "" })
                                                setIsResetPasswordDialogOpen(true)
                                            }}>
                                                <Key className="mr-2 h-4 w-4" /> Reset Password
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleRemoveAdmin(user.userId)}>
                                                <Trash className="mr-2 h-4 w-4" /> Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No admin users found.</p>
                    )}
                </div>

                <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Reset Admin Password</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input 
                                    id="newPassword" 
                                    type="password"
                                    value={resetPasswordForm.password}
                                    onChange={(e) => setResetPasswordForm({...resetPasswordForm, password: e.target.value})}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isResettingPassword} className="w-full">
                                Reset Password
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
          </Card>

          {/* Terminals List */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Terminals</CardTitle>
              <Dialog open={isTerminalDialogOpen} onOpenChange={setIsTerminalDialogOpen}>
                  <DialogTrigger asChild>
                      <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Terminal</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                          <DialogTitle>Add Terminal</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddTerminal} className="space-y-4">
                          <div className="space-y-2">
                              <Label htmlFor="terminalName">Name</Label>
                              <Input 
                                  id="terminalName" 
                                  value={terminalForm.name} 
                                  onChange={(e) => setTerminalForm({...terminalForm, name: e.target.value})}
                                  required
                                  placeholder="e.g. Front Desk"
                              />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="terminalSerial">Serial Number</Label>
                              <Input 
                                  id="terminalSerial" 
                                  value={terminalForm.serial} 
                                  onChange={(e) => setTerminalForm({...terminalForm, serial: e.target.value})}
                                  required
                                  placeholder="Serial Number"
                              />
                          </div>
                           <div className="space-y-2">
                              <Label htmlFor="terminalAlias">Alias (Optional)</Label>
                              <Input 
                                  id="terminalAlias" 
                                  value={terminalForm.alias} 
                                  onChange={(e) => setTerminalForm({...terminalForm, alias: e.target.value})}
                                  placeholder="Alias used in logs"
                              />
                          </div>
                          <Button type="submit" className="w-full" disabled={isAddingTerminal}>Add Terminal</Button>
                      </form>
                  </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Serial</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gym.terminals && gym.terminals.length > 0 ? (
                                gym.terminals.map((terminal) => (
                                    <tr key={terminal.terminalId} className="bg-background border-b last:border-0 hover:bg-muted/50">
                                        <td className="px-4 py-3 font-medium">{terminal.name}</td>
                                        <td className="px-4 py-3">{terminal.serial}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteTerminal(terminal.terminalId)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                                        No terminals found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Feature Management</CardTitle>
              <CardDescription>Enable or disable premium features for this gym</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {AVAILABLE_FEATURES.map((feature) => {
                const isEnabled = gym.features.some(f => f.code === feature.code)
                return (
                  <div key={`${feature.code}-${isEnabled}`} className="flex items-center justify-between space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => handleToggleFeature(feature.code, checked)}
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
