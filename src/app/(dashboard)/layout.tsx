"use client";

import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-0 lg:ml-64 min-w-0">{children}</div>
      </div>
    </SidebarProvider>
  );
}
