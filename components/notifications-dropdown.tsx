"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-6 w-80">
        <DropdownMenuItem>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">New test completed</p>
            <p className="text-xs text-muted-foreground">Your hypothesis test results are ready</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Data uploaded</p>
            <p className="text-xs text-muted-foreground">Your dataset has been processed successfully</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
