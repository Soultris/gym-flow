"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersHeader } from "@/components/members/members-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, Eye, Loader2, CheckCircle2, Search } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetMembersQuery, useApproveMemberMutation, useDeleteMemberMutation, useUpdateMemberMutation, Member } from "@/store/api/membersApi"
import { useGetPackagesQuery, Package } from "@/store/api/packagesApi"
import { useGetGymProfileQuery } from "@/store/api/gymApi"
import { PaginationControls } from "@/components/ui/pagination-controls"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { PhoneOtpVerify } from "@/components/phone-otp-verify"

const PAGE_SIZE = 20



function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function PendingMembersPage() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [memberToReview, setMemberToReview] = useState<Member | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // API hooks — use status filter directly
  const { data: membersData, isLoading, isError, refetch } = useGetMembersQuery({
    status: 'pending',
    page,
    limit: PAGE_SIZE,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  })
  
  const pendingMembers = membersData?.members || []
  const pagination = membersData?.pagination
  
  const handleReview = (member: Member) => {
    setMemberToReview(member)
    setReviewDialogOpen(true)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <MembersHeader />
          <div className="border border-[#2a2a2a] rounded-lg p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading pending members...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <MembersHeader />
          <div className="border border-[#2a2a2a] rounded-lg p-8 text-center">
            <p className="text-destructive">Failed to load pending members</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MembersHeader />

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, email or phone..."
            className="pl-9 bg-transparent border-[#2a2a2a] focus-visible:ring-primary"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {pendingMembers.length === 0 ? (
          <div className="border border-[#2a2a2a] rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              {debouncedSearch ? `No pending members matching "${debouncedSearch}"` : 'No pending members found'}
            </p>
          </div>
        ) : (
          <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
                  <th className="w-12 px-4 py-3">
                    <Checkbox className="border-[#3a3a3a]" />
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Submitted Date</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingMembers.map((member: Member, index: number) => (
                  <tr
                    key={member.memberId}
                    className={`border-b border-[#2a2a2a] transition-colors ${
                      index % 2 === 0 ? "bg-[#151515]" : "bg-background"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <Checkbox className="border-[#3a3a3a]" />
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/members/${member.memberId}`}
                        className="flex items-center gap-3 transition-opacity"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.imageUrl || "/placeholder.svg"} />
                          <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {formatDate(member.joiningDate)}
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 border-primary text-primary hover:bg-primary/10"
                        onClick={() => handleReview(member)}
                      >
                        <Eye className="h-4 w-4" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            {pagination && (
              <PaginationControls
                page={page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={PAGE_SIZE}
                onPageChange={setPage}
                itemLabel="pending members"
              />
            )}
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border p-0 gap-0">
            <div className="p-6 border-b border-border">
              <DialogHeader>
                <DialogTitle className="text-xl">Review Membership Request</DialogTitle>
              </DialogHeader>
            </div>

            {memberToReview && (
              <ReviewMemberContent 
                member={memberToReview} 
                onClose={() => setReviewDialogOpen(false)}
                refetch={refetch}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

function ReviewMemberContent({ member, onClose, refetch }: { member: Member, onClose: () => void, refetch: () => void }) {
    const { data: packages = [] } = useGetPackagesQuery()
    const { data: gym } = useGetGymProfileQuery()
    const [approveMember, { isLoading: isApproving }] = useApproveMemberMutation()
    const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation()
    const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation()

    const [selectedPlan, setSelectedPlan] = useState<string>(member.packageId?.toString() || packages[0]?.packageId?.toString() || "")
    const [membershipFee, setMembershipFee] = useState<string>("0")
    const [includeMembershipFee, setIncludeMembershipFee] = useState(true)
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")

    // Form data for editable fields
    const [formData, setFormData] = useState({
        name: member.name,
        email: member.email,
        phone: member.phone,
        dob: member.dob ? new Date(member.dob).toISOString().split('T')[0] : "",
        gender: member.gender,
        nic: member.nic,
        address: member.address,
        height: member.height,
        weight: member.weight,
        emergencyContactName: member.emergencyContactName || "",
        emergencyContactRelation: member.emergencyContactRelation || "",
        emergencyContactPhone: member.emergencyContactPhone || "",
        medicalIssues: member.medicalIssues || ""
    })

    // Initialize membership fee from gym settings
    useEffect(() => {
        if (gym?.membershipFee) {
            setTimeout(() => {
                setMembershipFee(String(gym.membershipFee))
            }, 0)
        }
    }, [gym])

    const handleAccept = async () => {
        try {
            // First update the member details
            await updateMember({
                id: member.memberId,
                data: {
                    ...formData,
                    height: Number(formData.height),
                    weight: Number(formData.weight)
                }
            }).unwrap()

            const packageId = selectedPlan ? parseInt(selectedPlan, 10) : undefined
            const fee = includeMembershipFee ? parseFloat(membershipFee) : 0
            
            await approveMember({ 
                id: member.memberId, 
                packageId,
                membershipFee: fee,
                paymentMethod
            }).unwrap()
            
            toast.success(`${formData.name} has been approved`)
            onClose()
            refetch()
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to approve member"))
        }
    }

    const handleReject = async () => {
        try {
            await deleteMember(member.memberId).unwrap()
            toast.success(`${member.name} has been rejected`)
            onClose()
            refetch()
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to reject member"))
        }
    }

    const selectedPlanData = packages.find((p: Package) => p.packageId?.toString() === selectedPlan)
    const planPrice = selectedPlanData?.price || 0
    const total = planPrice + (includeMembershipFee ? parseFloat(membershipFee || "0") : 0)

    const isProcessing = isApproving || isDeleting || isUpdating

    return (
        <div className="p-6 space-y-8">
            {/* Avatar Section - Centered */}
            <div className="flex justify-center mb-8">
                <Avatar className="h-32 w-32 border-4 border-muted">
                    <AvatarImage src={member.imageUrl || "/placeholder.svg"} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-secondary">{getInitials(member.name)}</AvatarFallback>
                </Avatar>
            </div>

            {/* Info Grid - Matching AddMemberForm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="space-y-2">
                    <Label>Member No.</Label>
                    <Input value="Pending" disabled className="bg-muted" />
                 </div>
                 
                 <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>

                 <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input 
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => {
                             const newDob = e.target.value;
                             setFormData({...formData, dob: newDob});
                        }}
                    />
                 </div>

                 <div className="space-y-2">
                    <Label>Age</Label>
                    <Input 
                        value={member.age} // Display original age or calculate from new DOB if needed
                        disabled 
                        className="bg-muted" 
                    />
                 </div>

                 <div className="space-y-2">
                    <Label htmlFor="phone">Mobile No.</Label>
                    <div className="flex gap-2">
                        <Input 
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                        <div className="shrink-0 pt-1">
                             <PhoneOtpVerify 
                                phone={formData.phone} 
                                type="member" 
                                id={member.memberId} 
                                phoneVerified={formData.phone === member.phone ? member.phoneVerified : false} 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                        value={formData.gender} 
                        onValueChange={(v: "male" | "female" | "other") => setFormData({...formData, gender: v})}
                    >
                        <SelectTrigger id="gender">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nic">NIC</Label>
                    <Input 
                        id="nic"
                        value={formData.nic}
                        onChange={(e) => setFormData({...formData, nic: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: Number(e.target.value)})}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input 
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
                    />
                </div>

                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                </div>
            </div>

            {/* Emergency Contact & Medical Info */}
            <div className="pt-6 border-t border-border mt-6">
                 <div className="mb-4">
                     <h3 className="font-semibold text-lg">Emergency Contact & Medical Details</h3>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="emergencyContactName">Contact Person Name</Label>
                        <Input 
                            id="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="emergencyContactRelation">Relation</Label>
                        <Input 
                            id="emergencyContactRelation"
                            value={formData.emergencyContactRelation}
                            onChange={(e) => setFormData({...formData, emergencyContactRelation: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="emergencyContactPhone">Contact Phone No.</Label>
                        <Input 
                            id="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="medicalIssues">Medical Issues / Conditions</Label>
                        <Input 
                            id="medicalIssues"
                            value={formData.medicalIssues}
                            onChange={(e) => setFormData({...formData, medicalIssues: e.target.value})}
                        />
                     </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-border mt-6">
                {/* Plan Selection */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-semibold text-lg">Membership Plan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {packages.map((plan: Package) => (
                          <div
                            key={plan.packageId}
                            onClick={() => setSelectedPlan(plan.packageId.toString())}
                            className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedPlan === plan.packageId.toString()
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{plan.name}</h4>
                                {selectedPlan === plan.packageId.toString() && <CheckCircle2 className="w-5 h-5 text-primary" />}
                            </div>
                            <div className="text-2xl font-bold text-primary mb-2">
                                {plan.price.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}
                                <span className="text-sm text-muted-foreground font-normal">/{plan.durationType}</span>
                            </div>
                           <ul className="space-y-1">
                              {(Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features || '[]') as string[]).slice(0, 3).map((feature: string, index: number) => (
                                <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Check className="w-3 h-3 text-primary" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Payment Summary</h3>
                    <Card className="p-5 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Plan Fee</span>
                            <span className="font-medium">{planPrice.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}</span>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2">
                             <div className="flex items-center gap-2">
                                <Switch checked={includeMembershipFee} onCheckedChange={setIncludeMembershipFee} id="fee-switch" />
                                <Label htmlFor="fee-switch" className="text-sm text-muted-foreground font-normal">Membership Fee</Label>
                             </div>
                             {includeMembershipFee ? (
                                 <Input 
                                    type="number" 
                                    value={membershipFee} 
                                    onChange={(e) => setMembershipFee(e.target.value)}
                                    className="w-24 h-8 text-right font-medium"
                                 />
                             ) : (
                                 <span className="text-sm font-medium text-muted-foreground line-through">
                                     {parseFloat(membershipFee).toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}
                                 </span>
                             )}
                        </div>

                        <div className="pt-3 mt-3 border-t border-border flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-primary">{total.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}</span>
                        </div>

                        <div className="pt-2">
                            <Label className="text-xs mb-1.5 block text-muted-foreground">Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={(v: "cash" | "card") => setPaymentMethod(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                            {isDeleting ? "Rejecting..." : "Reject"}
                        </Button>
                        <Button onClick={handleAccept} disabled={isProcessing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            {isProcessing ? "Processing..." : "Approve & Pay"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
