"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal, Search, X } from "lucide-react"

interface MembersFilterProps {
  onSearchChange: (search: string) => void
  onStatusFilterChange: (status: 'all' | 'active' | 'expired' | 'pending') => void
  searchValue: string
  selectedStatus: 'all' | 'active' | 'expired' | 'pending'
}

export function MembersFilter({
  onSearchChange,
  onStatusFilterChange,
  searchValue,
  selectedStatus,
}: MembersFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const statusOptions = [
    { value: 'all', label: 'All Members' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'pending', label: 'Pending' },
  ]

  const handleClearSearch = () => {
    onSearchChange("")
  }

  const handleStatusSelect = (status: 'all' | 'active' | 'expired' | 'pending') => {
    onStatusFilterChange(status)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Search Input */}
      <div className="relative flex-1 sm:flex-initial min-w-[120px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-8 bg-[#1a1a1a] border-[#2a2a2a] w-full"
        />
        {searchValue && (
          <button
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-[#2a2a2a] bg-transparent hover:bg-[#1a1a1a]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {selectedStatus !== 'all' && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-primary bg-primary/20 rounded-full">
                1
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-[#2a2a2a]">
          <DropdownMenuLabel className="text-muted-foreground">Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#2a2a2a]" />
          
          {statusOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedStatus === option.value}
              onCheckedChange={() => handleStatusSelect(option.value as 'all' | 'active' | 'expired' | 'pending')}
              className="cursor-pointer"
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator className="bg-[#2a2a2a]" />
          
          {(searchValue || selectedStatus !== 'all') && (
            <DropdownMenuItem
              onClick={() => {
                onSearchChange("")
                onStatusFilterChange('all')
              }}
              className="text-muted-foreground cursor-pointer"
            >
              Clear all filters
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
