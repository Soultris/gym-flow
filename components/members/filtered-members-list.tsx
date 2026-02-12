"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import { NewTransactionDialog } from "@/components/finance/new-transaction-dialog"
import { useGetMembersQuery, useDeleteMemberMutation, useDeactivateMemberMutation, useReactivateMemberMutation, Member } from "@/store/api/membersApi"
import toast from "react-hot-toast"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface FilteredMembersListProps {
  status: 'active' | 'expired' | 'pending' | 'deactivated'
}

export function FilteredMembersList({ status }: FilteredMembersListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Quick renewal params from URL
  const renewMemberId = searchParams.get("renewMemberId")
  const renewMemberName = searchParams.get("renewMemberName")
  
  // Derive dialog open state from URL params
  const isRenewDialogOpen = Boolean(renewMemberId && renewMemberName)
  
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'deactivate' | 'delete' | 'reactivate' | null>(null)
  const [memberToAction, setMemberToAction] = useState<{ id: number; name: string } | null>(null)

  // API hooks - fetch all members and filter client-side
  const { data, isLoading, isError } = useGetMembersQuery({ limit: 1000 })
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation()
  const [deactivateMember, { isLoading: isDeactivating }] = useDeactivateMemberMutation()
  const [reactivateMember, { isLoading: isReactivating }] = useReactivateMemberMutation()

  // Clear URL params when dialog is closed
  const handleRenewDialogClose = (open: boolean) => {
    if (!open && renewMemberId) {
      router.replace(`/members/${status}`)
    }
  }

  // Filter members by status
  const allMembers = data?.members || []
  const members = allMembers.filter((member: Member) => {
    const memberStatus = member.status || (member.isPending ? "pending" : "active")
    return memberStatus === status
  })

  const handleActionClick = (action: 'deactivate' | 'delete' | 'reactivate', id: number, name: string) => {
    setActionType(action)
    setMemberToAction({ id, name })
    setActionDialogOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!memberToAction || !actionType) return
    
    try {
      if (actionType === 'deactivate') {
        await deactivateMember(memberToAction.id).unwrap()
        toast.success(`${memberToAction.name} has been deactivated`)
      } else if (actionType === 'reactivate') {
        await reactivateMember(memberToAction.id).unwrap()
        toast.success(`${memberToAction.name} has been reactivated`)
        // After reactivation, the member moves to Active tab
        // RTK Query cache invalidation handles the refetch
      } else if (actionType === 'delete') {
        await deleteMember(memberToAction.id).unwrap()
        toast.success(`${memberToAction.name} has been permanently deleted`)
      }
      setActionDialogOpen(false)
      setMemberToAction(null)
      setActionType(null)
      // Don't manually refetch - let RTK Query cache invalidation handle it
    } catch (error) {
      toast.error(`Failed to ${actionType} member`)
    }
  }

  if (isLoading) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading members...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 text-center">
        <p className="text-destructive">Failed to load members</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No {status} members found</p>
        <Link href="/members/add">
          <Button className="mt-4 bg-primary text-primary-foreground">Add Member</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
            <th className="w-12 px-4 py-3">
              <Checkbox className="border-[#3a3a3a]" />
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Package</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Enrolled</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
              {status === 'expired' ? 'Expired Date' : 'Expiry Date'}
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Renew</th>
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member: Member, index: number) => {
            const latestPackage = member.memberPackages?.[0]
            const expiryDate = latestPackage?.expiresAt
            const memberStatus = member.status || (member.isPending ? "pending" : "active")
            
            return (
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
                <td className="px-4 py-4 text-sm">{member.package?.name || "No Package"}</td>
                <td className="px-4 py-4">
                  <Badge
                    variant="outline"
                    className={
                      memberStatus === "active"
                        ? "border-accent text-accent bg-accent/10"
                        : memberStatus === "expired"
                        ? "border-destructive text-destructive bg-destructive/10"
                        : memberStatus === "deactivated"
                        ? "border-gray-500 text-gray-500 bg-gray-500/10"
                        : "border-yellow-500 text-yellow-500 bg-yellow-500/10"
                    }
                  >
                    {memberStatus.charAt(0).toUpperCase() + memberStatus.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {formatDate(member.joiningDate)}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {expiryDate ? formatDate(expiryDate) : "-"}
                </td>
                <td className="px-4 py-4">
                  <NewTransactionDialog 
                    memberId={String(member.memberId)}
                    memberName={member.name}
                    triggerStyle="renew"
                    defaultTransactionType="membership"
                    defaultPackageId={latestPackage?.packageId?.toString() || member.package?.packageId?.toString() || ""}
                  />
                </td>
                <td className="px-4 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#2a2a2a] w-48">
                      <DropdownMenuItem asChild>
                        <Link href={`/members/${member.memberId}`} className="cursor-pointer">
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/members/${member.memberId}`} className="cursor-pointer">
                          Edit Member
                        </Link>
                      </DropdownMenuItem>
                      {memberStatus !== "deactivated" && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href={`/workouts?assignMemberId=${member.memberId}&assignMemberName=${encodeURIComponent(member.name)}&tab=assign`} className="cursor-pointer">
                              Assign Workout
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/bulk-sms?memberId=${member.memberId}&memberName=${member.name}`} className="cursor-pointer">
                              Send Message
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      {memberStatus !== "deactivated" && (
                        <DropdownMenuItem 
                          className="text-yellow-600 cursor-pointer"
                          onClick={() => handleActionClick('deactivate', member.memberId, member.name)}
                        >
                          Deactivate Member
                        </DropdownMenuItem>
                      )}
                      {memberStatus === "deactivated" && (
                        <>
                          <DropdownMenuItem 
                            className="text-blue-600 cursor-pointer"
                            onClick={() => handleActionClick('reactivate', member.memberId, member.name)}
                          >
                            Reactivate Member
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive cursor-pointer"
                            onClick={() => handleActionClick('delete', member.memberId, member.name)}
                          >
                            Permanently Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )
          })}
        </tbody>
        </table>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'deactivate' && 'Deactivate Member'}
              {actionType === 'reactivate' && 'Reactivate Member'}
              {actionType === 'delete' && 'Permanently Delete Member'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'deactivate' && (
                <>
                  Are you sure you want to deactivate <span className="font-semibold text-foreground">{memberToAction?.name}</span>? 
                  They will appear in the Deactivated tab but can be reactivated later.
                </>
              )}
              {actionType === 'reactivate' && (
                <>
                  Are you sure you want to reactivate <span className="font-semibold text-foreground">{memberToAction?.name}</span>? 
                  They will be able to access the gym again.
                </>
              )}
              {actionType === 'delete' && (
                <>
                  Are you sure you want to permanently delete <span className="font-semibold text-foreground">{memberToAction?.name}</span>? 
                  This action cannot be undone and all their data will be removed.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button 
              variant="outline" 
              onClick={() => setActionDialogOpen(false)} 
              className="flex-1 bg-transparent border-[#3a3a3a]"
              disabled={isDeleting || isDeactivating || isReactivating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAction} 
              className={`flex-1 ${
                actionType === 'delete' 
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                  : actionType === 'deactivate'
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={isDeleting || isDeactivating || isReactivating}
            >
              {(isDeleting || isDeactivating || isReactivating) ? 'Processing...' : (
                actionType === 'deactivate' ? 'Deactivate' :
                actionType === 'reactivate' ? 'Reactivate' :
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Renewal Transaction Dialog */}
      {renewMemberId && renewMemberName && (
        <NewTransactionDialog
          memberId={renewMemberId}
          memberName={renewMemberName}
          triggerStyle="hidden"
          defaultTransactionType="membership"
          openByDefault={isRenewDialogOpen}
          onOpenChange={handleRenewDialogClose}
        />
      )}
    </div>
  )
}
