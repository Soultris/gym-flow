"use client"

import { 
    useGetGymByIdQuery, 
    useToggleFeatureMutation, 
    useUpdateGymMutation, 
    useCreateGymAdminMutation 
} from "@/store/api/adminApi"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/ui/image-upload"
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
  }>({ 
      name: "", 
      subdomain: "",
      smsEmail: "",
      smsSenderId: "",
      smsApiKey: ""
  });
  const [logoFile, setLogoFile] = useState<File | string | null>(null)
  const [removeLogo, setRemoveLogo] = useState(false)
  
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false)
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" })

  const startEditing = () => {
      if (gym) {
          setEditForm({ 
              name: gym.name, 
              subdomain: gym.subdomain || "",
              smsEmail: gym.smsEmail,
              smsSenderId: gym.smsSenderId,
              smsApiKey: gym.smsApiKey
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
      <div className="space-y-6 max-w-5xl mx-auto">
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
                        <div className="space-y-2">
                            <Label>Gym Logo</Label>
                            <div className="max-w-[200px]">
                                <ImageUpload
                                    value={logoFile}
                                    onChange={(file) => {
                                        setLogoFile(file)
                                        setRemoveLogo(false)
                                    }}
                                    onRemove={() => {
                                        setLogoFile(null)
                                        setRemoveLogo(true)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="submit" disabled={isUpdating}>Save Changes</Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
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
                                <div className="col-span-2">
                                    <p className="text-xs font-medium text-muted-foreground">API Key</p>
                                    <p className="text-sm font-mono">{gym.smsApiKey ? "••••••••" : "Not configured"}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Logo</p>
                            {gym.logoUrl ? (
                                <img src={gym.logoUrl} alt="Gym Logo" className="mt-2 h-16 w-16 object-cover rounded-lg border" />
                            ) : (
                                <p className="text-lg">N/A</p>
                            )}
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
                                <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                    Admin
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No admin users found.</p>
                    )}
                </div>
            </CardContent>
          </Card>

          {/* Terminals List */}
          <Card>
            <CardHeader>
              <CardTitle>Terminals</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Serial</th>
                                <th className="px-4 py-3">Status</th>
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
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
