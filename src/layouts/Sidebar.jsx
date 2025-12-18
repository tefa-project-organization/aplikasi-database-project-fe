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
import { useTheme } from "@/context/ThemeContext";

// Icons
import WgsIconBlack from "@/assets/icon/logo_wgs_fullBlack.svg";
import WgsIconWhite from "@/assets/icon/logo_wgs_fullWhite.svg";
import dashboardIcon from "@/assets/icon/dashboard-icon.svg";
import projectsIcon from "@/assets/icon/projects-icon.svg";
import teamIcon from "@/assets/icon/team-icons.svg";
import userManagementIcon from "@/assets/icon/usermanagement-icon.svg";
import circleHeadlineIcon from "@/assets/icon/circle-headline.svg";

export default function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar();
  const { theme } = useTheme();

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
        ${open ? "px-4 py-4 justify-start gap-3" : "px-3 py-4 justify-center"}`}
      >
        <img
          src={circleHeadlineIcon}
          alt="Circle Headline"
          className={`
            transition-all duration-200
            ${open ? "h-8 w-8" : "h-6 w-6"}
          `}
        />

        {/* Hanya tampilkan teks saat sidebar terbuka */}
        {open && (
          <div className="flex flex-col w-full">
            <span className="text-lg font-semibold tracking-wide text-foreground">
              Database Project
            </span>
            <span className="text-xs text-muted-foreground">
              Where work comes together
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
                      <img
                        src={item.icon}
                        alt={item.label}
                        className={`
                        transition-all duration-200
                        ${open ? "h-4 w-4" : "h-3 w-3"}
                        ${theme === "dark" ? "invert" : ""}
                        `}
                      />

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

      {/* FOOTER - Logo saja */}
      <div className="border-t mt-auto p-3 flex justify-center">
        <img
          src={theme === "dark" ? WgsIconWhite : WgsIconBlack}
          alt="WGS Logo"
          className="h-5 w-auto"
        />
      </div>
    </Sidebar>
  );
}