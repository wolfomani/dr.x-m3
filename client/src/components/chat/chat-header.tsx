"use client"

import { Button } from "@/components/ui/button"
import { DrXLogo } from "../dr-x-logo"
import { Plus, Menu, Settings, User, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatHeaderProps {
  onClearChat: () => void
  isConnected: boolean
}

export function ChatHeader({ onClearChat, isConnected }: ChatHeaderProps) {
  return (
    <header className="glass-card sticky top-0 z-50 border-b-0 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Right side - Logo and Title */}
        <div className="flex items-center gap-3">
          <DrXLogo className="w-8 h-8" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gradient leading-none">dr.x AI</h1>
            <span className="text-xs text-muted-foreground">Powered by DeepSeek</span>
          </div>
        </div>

        {/* Center - Connection Status */}
        <div className="hidden md:flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-success animate-pulse" : "bg-destructive"}`} />
          <span className="text-sm text-muted-foreground">{isConnected ? "متصل" : "غير متصل"}</span>
        </div>

        {/* Left side - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="btn-ghost rounded-xl h-9 px-3">
            <Plus className="w-4 h-4 ml-2" />
            <span className="hidden sm:inline">محادثة جديدة</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="btn-ghost rounded-xl h-9 w-9">
                <Menu className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card">
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-2">
                  <User className="w-4 h-4" />
                  <span>الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Settings className="w-4 h-4" />
                  <span>الإعدادات</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onClearChat} className="gap-2 text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4" />
                <span>مسح المحادثة</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
