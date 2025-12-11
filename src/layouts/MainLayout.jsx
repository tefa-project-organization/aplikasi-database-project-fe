import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/layouts/Sidebar";
import Header from "@/layouts/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <AppSidebar />

        {/* Right section */}
        <div className="flex flex-col flex-1">
          <Header />

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
