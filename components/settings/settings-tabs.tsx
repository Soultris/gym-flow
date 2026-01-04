"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export function SettingsTabs() {
  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab") || "notifications"

  const tabs = [
    { name: "Notifications", value: "notifications" },
    { name: "Security", value: "security" },
  ]

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#2a2a2a] mb-6">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.value
          return (
            <Link key={tab.value} href={`/settings?tab=${tab.value}`}>
              <button 
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.name}
              </button>
            </Link>
          )
        })}
      </div>

      {/* Notifications Tab Content */}
      {currentTab === "notifications" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">Payment Reminders</p>
                <p className="text-sm text-muted-foreground">Send SMS reminders for pending payments</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-border" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">Membership Expiry</p>
                <p className="text-sm text-muted-foreground">Notify members 7 days before expiry</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-border" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">New Member Welcome</p>
                <p className="text-sm text-muted-foreground">Send welcome message to new members</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-border" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">Daily Reports</p>
                <p className="text-sm text-muted-foreground">Receive daily revenue and attendance summary</p>
              </div>
              <input type="checkbox" className="rounded border-border" />
            </div>
          </div>
          <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">Save Preferences</Button>
        </Card>
      )}

      {/* Security Tab Content */}
      {currentTab === "security" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
          <form className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Change Password</h4>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Update Security</Button>
          </form>
        </Card>
      )}
    </div>
  )
}
