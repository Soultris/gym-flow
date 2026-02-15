"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGetMembersQuery, useDeleteMemberMutation, useDeactivateMemberMutation, useReactivateMemberMutation, Member } from "@/store/api/membersApi"
import { MembersFilter } from "@/components/members/members-filter"
import { MembersTable } from "@/components/members/members-table"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"

export function MembersList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Quick renewal params from URL
  const renewMemberId = searchParams.get("renewMemberId")
  const renewMemberName = searchParams.get("renewMemberName")

  // Derive dialog open state from URL params
  const isRenewDialogOpen = Boolean(renewMemberId && renewMemberName)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<{ id: number; name: string } | null>(null)
  const [memberToDeactivate, setMemberToDeactivate] = useState<{ id: number; name: string } | null>(null)
  const [memberToReactivate, setMemberToReactivate] = useState<{ id: number; name: string } | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'expired' | 'pending' | 'deactivated'>('all')

  // Set status filter based on URL pathname
  useEffect(() => {
    const pathSegment = pathname.split("/")[2]
    if (pathSegment && ['active', 'expired', 'pending', 'deactivated'].includes(pathSegment)) {
      // eslint-disable-next-line
      setSelectedStatus(pathSegment as 'active' | 'expired' | 'pending' | 'deactivated')
    } else {
      setSelectedStatus('all')
    }
  }, [pathname])

  // Memoize query params to ensure RTK Query cache key changes properly
  const queryParams = useMemo(() => {
    return selectedStatus !== 'all'
      ? { status: selectedStatus, limit: 1000 }
      : { limit: 1000 }
  }, [selectedStatus])

  // API hooks
  const { data, isLoading, isError, refetch } = useGetMembersQuery(queryParams)
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation()
  const [deactivateMember, { isLoading: isDeactivating }] = useDeactivateMemberMutation()
  const [reactivateMember, { isLoading: isReactivating }] = useReactivateMemberMutation()

  // Refetch when selected status changes
  useEffect(() => {
    refetch()
  }, [selectedStatus, refetch])

  // Clear URL params when dialog is closed
  const handleRenewDialogClose = (open: boolean) => {
    if (!open && renewMemberId) {
      router.replace("/members")
    }
  }

  let members = data?.members || []

  // Apply search filter (API already handles status filtering)
  if (searchValue.trim()) {
    const searchLower = searchValue.toLowerCase()
    members = members.filter((m: Member) =>
      m.name.toLowerCase().includes(searchLower) ||
      m.email.toLowerCase().includes(searchLower) ||
      m.phone.includes(searchValue)
    )
  }

  const handleDeleteClick = (id: number, name: string) => {
    setMemberToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  const handleDeactivateClick = (id: number, name: string) => {
    setMemberToDeactivate({ id, name })
    setDeactivateDialogOpen(true)
  }

  const handleReactivateClick = (id: number, name: string) => {
    setMemberToReactivate({ id, name })
    setReactivateDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return

    try {
      await deleteMember(memberToDelete.id).unwrap()
      toast.success(`${memberToDelete.name} has been deleted`)
      setDeleteDialogOpen(false)
      setMemberToDelete(null)
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete member"))
    }
  }

  const handleConfirmDeactivate = async () => {
    if (!memberToDeactivate) return

    try {
      await deactivateMember(memberToDeactivate.id).unwrap()
      toast.success(`${memberToDeactivate.name} has been deactivated`)
      setDeactivateDialogOpen(false)
      setMemberToDeactivate(null)
    } catch {
      toast.error("Failed to deactivate member")
    }
  }

  const handleConfirmReactivate = async () => {
    if (!memberToReactivate) return

    try {
      await reactivateMember(memberToReactivate.id).unwrap()
      toast.success(`${memberToReactivate.name} has been reactivated`)
      setReactivateDialogOpen(false)
      setMemberToReactivate(null)
    } catch {
      toast.error("Failed to reactivate member")
    }
  }

  if (members.length === 0 && !isLoading && searchValue.trim()) {
    return (
      <div className="flex flex-col gap-4">
        {/* <MembersFilter
          onSearchChange={setSearchValue}
          onStatusFilterChange={setSelectedStatus}
          searchValue={searchValue}
          selectedStatus={selectedStatus}
        /> */}
        <div className="border border-[#2a2a2a] rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No members found matching your search</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* <MembersFilter
        onSearchChange={setSearchValue}
        onStatusFilterChange={setSelectedStatus}
        searchValue={searchValue}
        selectedStatus={selectedStatus}
      />
      */}
      <MembersTable
        members={members}
        isLoading={isLoading}
        isError={isError}
        statusFilter={selectedStatus as any}
        onDeleteClick={handleDeleteClick}
        onDeactivateClick={handleDeactivateClick}
        onReactivateClick={handleReactivateClick}
        onRetry={() => refetch()}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">{memberToDelete?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1 bg-transparent border-[#3a3a3a]"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Deactivate Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate <span className="font-semibold text-foreground">{memberToDeactivate?.name}</span>? They will be moved to the Deactivated tab and can be reactivated later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeactivateDialogOpen(false)}
              className="flex-1 bg-transparent border-[#3a3a3a]"
              disabled={isDeactivating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDeactivate}
              className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
              disabled={isDeactivating}
            >
              {isDeactivating ? "Deactivating..." : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reactivate Confirmation Dialog */}
      <Dialog open={reactivateDialogOpen} onOpenChange={setReactivateDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Reactivate Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to reactivate <span className="font-semibold text-foreground">{memberToReactivate?.name}</span>? They will be moved back to the Active tab.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setReactivateDialogOpen(false)}
              className="flex-1 bg-transparent border-[#3a3a3a]"
              disabled={isReactivating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReactivate}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
              disabled={isReactivating}
            >
              {isReactivating ? "Reactivating..." : "Reactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
