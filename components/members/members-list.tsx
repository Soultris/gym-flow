"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useGetMembersQuery, useDeleteMemberMutation, useDeactivateMemberMutation, useReactivateMemberMutation } from "@/store/api/membersApi"
import { MembersTable } from "@/components/members/members-table"
import { PaginationControls } from "@/components/ui/pagination-controls"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"

const PAGE_SIZE = 20

export function MembersList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Quick renewal params from URL
  const renewMemberId = searchParams.get("renewMemberId")
  const renewMemberName = searchParams.get("renewMemberName")
  const isRenewDialogOpen = Boolean(renewMemberId && renewMemberName)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<{ id: number; name: string } | null>(null)
  const [memberToDeactivate, setMemberToDeactivate] = useState<{ id: number; name: string } | null>(null)
  const [memberToReactivate, setMemberToReactivate] = useState<{ id: number; name: string } | null>(null)


  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setPage(1) // Reset to page 1 on new search
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading, isError, refetch } = useGetMembersQuery({
    page,
    limit: PAGE_SIZE,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  })

  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation()
  const [deactivateMember, { isLoading: isDeactivating }] = useDeactivateMemberMutation()
  const [reactivateMember, { isLoading: isReactivating }] = useReactivateMemberMutation()

  const handleRenewDialogClose = (open: boolean) => {
    if (!open && renewMemberId) {
      router.replace("/members")
    }
  }

  const members = data?.members || []
  const pagination = data?.pagination

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

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by name, email or phone..."
          className="pl-9 bg-transparent border-[#2a2a2a] focus-visible:ring-primary"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <MembersTable
        members={members}
        isLoading={isLoading}
        isError={isError}
        onDeleteClick={handleDeleteClick}
        onDeactivateClick={handleDeactivateClick}
        onReactivateClick={handleReactivateClick}
        onRetry={() => refetch()}
      />

      {pagination && (
        <PaginationControls
          page={page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

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
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="flex-1 bg-transparent border-[#3a3a3a]" disabled={isDeleting}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isDeleting}>
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
            <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)} className="flex-1 bg-transparent border-[#3a3a3a]" disabled={isDeactivating}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDeactivate} className="flex-1 bg-orange-600 text-white hover:bg-orange-700" disabled={isDeactivating}>
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
            <Button variant="outline" onClick={() => setReactivateDialogOpen(false)} className="flex-1 bg-transparent border-[#3a3a3a]" disabled={isReactivating}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReactivate} className="flex-1 bg-green-600 text-white hover:bg-green-700" disabled={isReactivating}>
              {isReactivating ? "Reactivating..." : "Reactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
