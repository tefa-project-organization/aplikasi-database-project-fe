import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

export default function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar();
  const [selectedWorkspace, setSelectedWorkspace] = useState("ws-1");

  // Menu utama sesuai urutan
  const menuItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projects", href: "/projects" },
    { label: "Team", href: "/team" },
    { label: "User Management", href: "/user-management" },
  ];

  // Workspace tunggal: project-1
  const workspaces = [{ id: "ws-1", name: "project-1", meta: "1 workspace" }];

  return (
    <Sidebar collapsible="icon" className={`transition-all duration-200 ${open ? "w-64" : "w-14"}`}>
      {/* HEADER */}
      <SidebarHeader className="px-0 py-3 border-b">
        <div className={`flex items-center ${open ? "justify-start px-4 gap-3" : "justify-center px-2"}`}>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`flex items-center w-full ${open ? "justify-start gap-3" : "justify-center"}`}
                onClick={() => isMobile && setOpenMobile(false)}
                aria-label="Switch workspace"
              >
                <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M3 3h18v18H3z" /></svg>
                </div>

                <div className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${open ? "ml-2 opacity-100 max-w-[140px]" : "opacity-0 max-w-0"}`}>
                  <div className="font-semibold text-sm leading-tight">{workspaces.find(w => w.id === selectedWorkspace)?.name}</div>
                  <div className="text-xs text-muted-foreground">{workspaces.find(w => w.id === selectedWorkspace)?.meta}</div>
                </div>

                {open && <ChevronDown size={16} className="ml-auto text-muted-foreground" />}
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-56 p-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Switch workspace</div>
                <div className="flex flex-col gap-1">
                  {workspaces.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWorkspace(w.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent ${selectedWorkspace === w.id ? "bg-accent/10" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-sm bg-slate-200 flex items-center justify-center text-xs text-slate-700">{w.name[0]?.toUpperCase()}</div>
                        <div className="text-sm">{w.name}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{w.meta}</div>
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarMenu className="py-2 gap-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <NavLink to={item.href} onClick={() => isMobile && setOpenMobile(false)}>
                {({ isActive }) => (
                  <SidebarMenuButton asChild tooltip={item.label} data-active={isActive ? "true" : "false"}>
                    <div className={`flex items-center rounded-md transition-all duration-200 ${open ? "px-4 py-2 justify-start" : "p-2 justify-center"}`}>
                      {open && <span className="text-sm">{item.label}</span>}
                    </div>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
