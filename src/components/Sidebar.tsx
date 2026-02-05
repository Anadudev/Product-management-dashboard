"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  Layers,
  Key,
  Truck,
  Settings,
  Users,
  Plus,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { useSidebar } from "@/contexts/SidebarContext";

const menuItems = [
  {
    group: "WORKSPACE",
    items: [
      { name: "Analytics", icon: BarChart3, href: "/analytics" },
      { name: "Products", icon: Package, href: "/products", badge: "New 4" },
      { name: "Bundle", icon: Layers, href: "/bundle" },
      { name: "License Keys", icon: Key, href: "/license-keys" },
      { name: "Dropshipping", icon: Truck, href: "/dropshipping" },
    ],
  },
  {
    group: "SETTINGS",
    items: [
      { name: "General", icon: Settings, href: "/settings" },
      { name: "Team", icon: Users, href: "/team" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={close}
      />

      <aside
        className={cn(
          "w-64 h-screen bg-white border-r border-border flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Fikri Store
            </span>
          </div>
          <button
            onClick={close}
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-4 mb-6">
          <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-white border-none shadow-sm shadow-primary/20 h-11">
            <Plus className="w-5 h-5" />
            New Action
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4">
          {menuItems.map((group) => (
            <div key={group.group} className="mb-6">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.group}
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        close();
                        router.push(item.href);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "w-5 h-5",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        {item.name}
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground border border-border">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="bg-muted rounded-xl p-4 flex flex-col gap-2">
            <span className="text-sm font-bold text-foreground">
              Need some help?
            </span>
            <button className="text-xs text-primary hover:underline text-left">
              Drop us a word
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
