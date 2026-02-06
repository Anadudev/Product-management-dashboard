"use client";

import * as React from "react";
import { useState } from "react";

import {
  Search,
  Bell,
  MessageSquare,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useSidebar } from "@/contexts/SidebarContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function TopNav({
  items = [],
}: {
  items?: BreadcrumbItem[];
  onMenuClick?: () => void;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggle } = useSidebar();

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sticky top-0 z-20">
      {/* Mobile Search Overlay or Replacement */}
      {isSearchOpen ? (
        <div className="absolute inset-0 bg-white z-30 flex items-center px-4 w-full h-16 animate-in fade-in slide-in-from-top-2">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full bg-muted border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
            />
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 -mr-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : null}

      {/* Left Section: Menu & Breadcrumbs */}
      <div
        className={cn(
          "flex items-center gap-2 text-sm text-muted-foreground overflow-hidden",
          isSearchOpen && "invisible md:visible",
        )}
      >
        <button
          onClick={toggle}
          className="lg:hidden p-2 -ml-2 mr-2 rounded-lg hover:bg-muted transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="hidden sm:inline font-medium text-foreground">
            Anadu Store
          </span>
          <ChevronRight className="w-4 h-4 hidden sm:block shrink-0" />
          <span
            className={cn(
              items.length === 0 && "text-foreground font-medium",
              "truncate",
            )}
          >
            Products
          </span>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span
                className={cn(
                  index === items.length - 1 && "text-foreground font-medium",
                  "truncate max-w-[100px] sm:max-w-[200px]",
                )}
              >
                {item.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Center Section: Desktop Search */}
      <div className="hidden md:flex flex-1 max-w-2xl px-8 justify-center">
        <div className="relative group w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search or Press '/' for commands"
            className="w-full bg-muted border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      {/* Right Section: Actions */}
      <div
        className={cn(
          "flex items-center gap-2 sm:gap-4 ml-auto pl-2",
          isSearchOpen && "invisible md:visible",
        )}
      >
        {/* Mobile Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>

        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <button className="hidden sm:block p-2 rounded-lg hover:bg-muted transition-colors">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white cursor-pointer overflow-hidden shrink-0">
          FK
        </div>
      </div>
    </header>
  );
}
