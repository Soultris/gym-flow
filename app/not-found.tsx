import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="bg-muted/30 p-8 rounded-full mb-6">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
        Page not found
      </h1>
      <p className="max-w-md text-muted-foreground text-lg mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button size="lg" className="gap-2">
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}
