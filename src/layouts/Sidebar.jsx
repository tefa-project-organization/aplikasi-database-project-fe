import React from "react";
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

export default function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projects", href: "/projects" },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className={`transition-all duration-200 ${open ? "w-64" : "w-14"}`}
    >
      {/* HEADER */}
      <SidebarHeader className="px-0 py-4 border-b">
        <div
          className={`w-full text-center font-semibold tracking-wide transition-all duration-200 ${
            open ? "text-base" : "text-sm"
          }`}
        >
          TEFA
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarMenu className="py-2 gap-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <NavLink
                to={item.href}
                onClick={() => isMobile && setOpenMobile(false)}
              >
                {({ isActive }) => (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    data-active={isActive ? "true" : "false"}
                  >
                    <div
                      className={`flex items-center rounded-md transition-all duration-200 ${
                        open
                          ? "px-4 py-2 justify-start"
                          : "p-2 justify-center"
                      }`}
                    >
                      {open && (
                        <span className="text-sm">{item.label}</span>
                      )}
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
