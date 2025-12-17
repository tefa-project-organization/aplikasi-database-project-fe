import React from "react"
import { Outlet } from "react-router-dom"

// Sidebar dan Header
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/layouts/Sidebar"
import Header from "@/layouts/Header"

export default function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}