"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  onRemove: () => void
  className?: string
  previewClassName?: string
}

export function ImageUpload({ value, onChange, onRemove, className, previewClassName }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    if (typeof value === 'string') return value
    if (value instanceof File) return URL.createObjectURL(value)
    return null
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onChange(file)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      {!previewUrl ? (
        <div 
          onClick={triggerUpload}
          className={cn(
            "border-2 border-dashed border-input hover:border-primary/50 transition-colors rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted/50 hover:bg-muted",
            className
          )}
        >
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">Click to upload image</p>
            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        </div>
      ) : (
        <div className={cn("relative rounded-lg overflow-hidden border border-border group", previewClassName)}>
          <div className="aspect-square relative w-full h-full min-h-[200px] bg-muted">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
