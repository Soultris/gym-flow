"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { NewTransactionDialog } from "@/components/finance/new-transaction-dialog"
import { Member } from "@/store/api/membersApi"

interface MembersTableProps {
  members: Member[]
  isLoading: boolean
  isError: boolean
  statusFilter?: 'active' | 'expired' | 'pending' | 'deactivated'
  onDeleteClick?: (id: number, name: string) => void
  onDeactivateClick?: (id: number, name: string) => void
  onReactivateClick?: (id: number, name: string) => void
  onRetry?: () => void
}

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

export function MembersTable({
  members,
  isLoading,
  isError,
  statusFilter,
  onDeleteClick,
  onDeactivateClick,
  onReactivateClick,
  onRetry,
}: MembersTableProps) {
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
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-96">
          <thead>
            <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
              <th className="w-12 px-4 py-3">
                <Checkbox className="border-[#3a3a3a]" />
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Package</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Device Sync</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Started Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Expiry Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Renew</th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center bg-[#1a1a1a]/50">
                  <Loader2 className="h-8 w-8 animate-spin text-primary inline-block" />
                  <span className="ml-2 text-muted-foreground">Loading members...</span>
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                  No members found
                </td>
              </tr>
            ) : (
              members.map((member, index) => {
                const latestPackage = member.memberPackages?.[0]
                const expiryDate = latestPackage?.expiresAt
                const status = member.status || (member.isPending ? "pending" : "active")

                return (
                  <tr
                    key={member.memberId}
                    className={`border-b border-[#2a2a2a] transition-colors ${index % 2 === 0 ? "bg-[#151515]" : "bg-background"
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
                          status === "active"
                            ? "border-green-500 text-green-500 bg-green-500/10"
                            : status === "expired"
                              ? "border-destructive text-destructive bg-destructive/10"
                              : status === "deactivated"
                                ? "border-gray-500 text-gray-500 bg-gray-500/10"
                                : "border-yellow-500 text-yellow-500 bg-yellow-500/10"
                        }
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      {member.deviceSyncState ? (
                        <Badge
                          variant="outline"
                          className={
                            member.deviceSyncState === 'SYNCED'
                              ? "border-green-500 text-green-500 bg-green-500/10 whitespace-nowrap"
                              : member.deviceSyncState === 'FAILED'
                                ? "border-destructive text-destructive bg-destructive/10 whitespace-nowrap"
                                : "border-yellow-500 text-yellow-500 bg-yellow-500/10 whitespace-nowrap"
                          }
                        >
                          {member.deviceSyncState}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {formatDate(member.joiningDate)}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {expiryDate ? formatDate(expiryDate) : "-"}
                    </td>
                    <td className="px-4 py-4">
                      {status !== 'deactivated' && (
                        <NewTransactionDialog
                          memberId={String(member.memberId)}
                          memberName={member.name}
                          triggerStyle="renew"
                        />
                      )}
                      {status === 'deactivated' && (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
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
                          {status !== 'deactivated' && (
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
                          {status !== 'deactivated' && (
                            <DropdownMenuItem
                              className="text-orange-500 cursor-pointer"
                              onClick={() => onDeactivateClick?.(member.memberId, member.name)}
                            >
                              Deactivate Member
                            </DropdownMenuItem>
                          )}
                          {status === 'deactivated' && (
                            <DropdownMenuItem
                              className="text-green-500 cursor-pointer"
                              onClick={() => onReactivateClick?.(member.memberId, member.name)}
                            >
                              Reactivate Member
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => onDeleteClick?.(member.memberId, member.name)}
                          >
                            Delete Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
