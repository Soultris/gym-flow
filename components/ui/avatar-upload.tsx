"use client"

import { useState, useRef, useEffect } from "react"
import { Pencil, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  disabled?: boolean
  className?: string
}

export function AvatarUpload({ value, onChange, disabled, className }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [internalPreview, setInternalPreview] = useState<string | null>(null);

  // Derive preview URL: from props (string) or internal state (File/Blob)
  const previewUrl = typeof value === 'string' ? value : internalPreview;

  // Sync internal preview when value is File
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setTimeout(() => setInternalPreview(url), 0)
      // Cleanup
      return () => URL.revokeObjectURL(url)
    } else if (value === null || value === undefined) {
      setTimeout(() => setInternalPreview(null), 0)
    }
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
    }
  }

  const triggerUpload = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={disabled}
      />
      
      <div 
        className={cn(
          "h-32 w-32 rounded-full overflow-hidden border-4 border-background bg-muted flex items-center justify-center relative shadow-lg",
          !disabled && "cursor-pointer group"
        )}
        onClick={triggerUpload}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-12 w-12 text-muted-foreground" />
        )}
        
        {!previewUrl && !disabled && (
           <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        )}
      </div>

      {!disabled && (
        <button
          type="button"
          onClick={triggerUpload}
          className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-10"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
