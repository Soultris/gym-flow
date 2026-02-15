"use client"

import { useGetGymProfileQuery, useUpdateGymProfileMutation, useGetSmsBalanceQuery } from "@/store/api/gymApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { Link2 } from "lucide-react"

export function SmsConfigForm() {
    const { data: gym, isLoading } = useGetGymProfileQuery()
    const { data: balanceData, refetch: refetchBalance } = useGetSmsBalanceQuery()
    
    // Auto-refetch balance every 30 seconds if configured
    useEffect(() => {
        if (balanceData?.configured) {
            const interval = setInterval(() => {
                refetchBalance();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [balanceData?.configured, refetchBalance]);

    const [updateGym, { isLoading: isUpdating }] = useUpdateGymProfileMutation()
    
    const [formData, setFormData] = useState({
        smsEmail: "",
        smsSenderId: "",
        smsApiKey: "",
    })

    // Sync form state when gym data loads/changes
    useEffect(() => {
        if (gym) {
            setTimeout(() => {
                setFormData({
                    smsEmail: gym.smsEmail || "",
                    smsSenderId: gym.smsSenderId || "",
                    smsApiKey: gym.smsApiKey || "",
                })
            }, 0)
        }
    }, [gym])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const fd = new FormData()
            // We need to append existing fields or backend might clear them if updateGymProfile expects all fields?
            // Actually `updateGymProfile` in controller builds `updateData` based on what's present in body.
            // But usually FormData requires us to send what we want to update.
            // The controller code:
            // const { name, ... smsEmail } = req.body;
            // updateData = { name, ... smsEmail }
            // If name is undefined in req.body, it puts undefined in updateData.
            // Prisma ignores undefined values in update.
            // So we can send ONLY the SMS fields.
            
            // However, the `updateGymProfile` mutation expects `FormData`.
            // Let's safe-guard by only sending SMS fields.
            fd.append("smsEmail", formData.smsEmail)
            fd.append("smsSenderId", formData.smsSenderId)
            fd.append("smsApiKey", formData.smsApiKey)

            await updateGym(fd).unwrap()
            toast.success("SMS configuration updated successfully")
            refetchBalance()
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to update SMS configuration"))
        }
    }

    if (isLoading) {
        return <div>Loading configuration...</div>
    }

    return (
        <div className="space-y-6">
            {/* Balance Card */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">SMS Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold">
                                {balanceData?.configured ? `LKR ${balanceData.balance}` : "Not Configured"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {balanceData?.configured 
                                    ? "Available credit in your QuickSend account" 
                                    : "Configure your credentials below to see balance"}
                            </p>
                        </div>
                        {balanceData?.configured && balanceData.email && (
                            <Button asChild variant="outline">
                                <a 
                                    href={`https://quicksend.lk/Client/topup.php?email=${balanceData.email}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <Link2 className="h-4 w-4" />
                                    Top Up via QuickSend
                                </a>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Configuration Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Enter your QuickSend SMS gateway credentials</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="smsEmail">QuickSend Email</Label>
                                <Input
                                    id="smsEmail"
                                    value={formData.smsEmail}
                                    onChange={(e) => setFormData({ ...formData, smsEmail: e.target.value })}
                                    placeholder="email@example.com"
                                    type="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="smsSenderId">Sender ID</Label>
                                <Input
                                    id="smsSenderId"
                                    value={formData.smsSenderId}
                                    onChange={(e) => setFormData({ ...formData, smsSenderId: e.target.value })}
                                    placeholder="e.g. MYGYM"
                                    maxLength={11}
                                />
                                <p className="text-xs text-muted-foreground">Max 11 characters</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="smsApiKey">API Key</Label>
                                <Input
                                    id="smsApiKey"
                                    value={formData.smsApiKey}
                                    onChange={(e) => setFormData({ ...formData, smsApiKey: e.target.value })}
                                    type="password"
                                    placeholder="Enter your API Key"
                                />
                            </div>
                        </div>

                        <div className="flex justify-start pt-4">
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? "Saving..." : "Save Configuration"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
