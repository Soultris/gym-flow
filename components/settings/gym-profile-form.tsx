"use client"

import { useGetGymProfileQuery, useUpdateGymProfileMutation } from "@/store/api/gymApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export function GymProfileForm() {
    const { data: gym, isLoading } = useGetGymProfileQuery()
    const [updateGym, { isLoading: isUpdating }] = useUpdateGymProfileMutation()
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        fingerprintUsername: "",
        fingerprintPassword: "",
        terminalSerial: "",
    })
    const [logoFile, setLogoFile] = useState<File | string | null>(null)
    const [removeLogo, setRemoveLogo] = useState(false)

    // Sync form state when gym data loads/changes
    useEffect(() => {
        if (gym) {
            setFormData({
                name: gym.name || "",
                address: gym.address || "",
                phone: gym.phone || "",
                fingerprintUsername: gym.fingerprintUsername || "",
                fingerprintPassword: gym.fingerprintPassword || "",
                terminalSerial: gym.terminalSerial || "",
            })
            if (gym.logoUrl) {
                setLogoFile(gym.logoUrl)
            }
        }
    }, [gym])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const fd = new FormData()
            fd.append("name", formData.name)
            fd.append("address", formData.address)
            fd.append("phone", formData.phone)
            fd.append("fingerprintUsername", formData.fingerprintUsername)
            fd.append("fingerprintPassword", formData.fingerprintPassword)
            fd.append("terminalSerial", formData.terminalSerial)

            if (logoFile instanceof File) {
                fd.append("logo", logoFile)
            } else if (removeLogo) {
                fd.append("removeLogo", "true")
            }

            await updateGym(fd).unwrap()
            toast.success("Gym profile updated successfully")
        } catch {
            toast.error("Failed to update gym profile")
        }
    }

    if (isLoading) {
        return <div>Loading profile...</div>
    }

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle>Gym Profile</CardTitle>
                <CardDescription>Update your gym&apos;s public information and settings</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Logo Upload */}
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

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Gym Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">Hardware Integration</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                             <div className="space-y-2">
                                <Label htmlFor="terminalSerial">Terminal Serial</Label>
                                <Input
                                    id="terminalSerial"
                                    value={formData.terminalSerial}
                                    onChange={(e) => setFormData({ ...formData, terminalSerial: e.target.value })}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="fingerprintUsername">Fingerprint Username</Label>
                                <Input
                                    id="fingerprintUsername"
                                    value={formData.fingerprintUsername}
                                    onChange={(e) => setFormData({ ...formData, fingerprintUsername: e.target.value })}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="fingerprintPassword">Fingerprint Password</Label>
                                <Input
                                    id="fingerprintPassword"
                                    type="password"
                                    value={formData.fingerprintPassword}
                                    onChange={(e) => setFormData({ ...formData, fingerprintPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start pt-4">
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
