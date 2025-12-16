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

// Icons
import headerIcon from "@/assets/icon/header-icon.svg";
import dashboardIcon from "@/assets/icon/dashboard-icon.svg";
import projectsIcon from "@/assets/icon/projects-icon.svg";
import teamIcon from "@/assets/icon/team-icons.svg";
import userManagementIcon from "@/assets/icon/usermanagement-icon.svg";

export default function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: dashboardIcon,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: projectsIcon,
    },
    {
      label: "Team",
      href: "/team",
      icon: teamIcon,
    },
    {
      label: "User Management",
      href: "/usermanagement",
      icon: userManagementIcon,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className={`transition-all duration-200 ${open ? "w-64" : "w-14"}`}
    >
      {/* HEADER */}
      <div
        className={`flex items-center border-b transition-all duration-200
  ${open ? "gap-3 px-4 py-4 justify-start" : "px-3 py-4 justify-center"}`}
      >
        <img
          src={headerIcon}
          alt="TEFA Logo"
          className="h-8 w-8"
        />

        {open && (
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-wide whitespace-nowrap">
              Database Project
            </span>
            <span className="text-xs text-gray-500">
              Lorem ipsum dolor sit amet
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <SidebarContent className={`${open ? "px-3" : "px-1"}`}>
        <SidebarMenu className="py-3 gap-1">
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
                      className={`flex items-center gap-2 rounded-md transition-all duration-200
                      ${open ? "px-4 py-2 justify-start" : "p-3 justify-center"}
                      data-[active=true]:bg-accent`}
                    >
                      {/* ICON */}
                      <img
                        src={item.icon}
                        alt={item.label}
                        className={`
                        transition-all duration-200 dark:invert
                        ${open ? "h-5 w-5" : "h-4 w-4"}
                        `}
                      />

                      {/* LABEL */}
                      {open && (
                        <span className="text-sm font-semibold tracking-wide whitespace-nowrap text-sidebar-text">
                          {item.label}
                        </span>
                      )}
                    </div>

                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar >
  );
}