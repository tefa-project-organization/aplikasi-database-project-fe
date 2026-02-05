// src\layouts\Header.jsx
import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Avatar from "boring-avatars";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen, Sun, Moon, LogOut } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

function formatBreadcrumb(name) {
  const map = {
    usermanagement: "User Management",
    "upload-documents": "Upload Documents",
    pic: "PIC",
    employee: "Employee",
    projects: "Projects",
    dashboard: "Dashboard",
    team: "Team",
    history: "History",
  };

  const key = String(name).toLowerCase();
  if (map[key]) return map[key];

  // convert kebab-case and camelCase to spaced words, then Title Case
  const spaced = name
    .replace(/-/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");

  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Header() {
  const { open, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const { theme, toggleTheme } = useTheme();
  const { employees } = useAuth(); // HAPUS logout dari sini

  /**
   * AMBIL EMAIL DARI BERBAGAI KEMUNGKINAN STRUKTUR
   */
  const getUserEmail = () => {
    if (!employees) {
      return "user@example.com";
    }

    // Struktur: employees.employees.email (berdasarkan console.log)
    if (employees.employees?.email) {
      return employees.employees.email;
    }

    // Fallback langsung
    if (employees.email) {
      return employees.email;
    }

    // Fallback dari localStorage
    try {
      const stored = localStorage.getItem("employees");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.employees?.email || parsed.email || "user@example.com";
      }
    } catch (e) {
      console.warn("Gagal parse localStorage:", e);
    }

    return "user@example.com";
  };

  const userEmail = getUserEmail();

  // Navigate ke /logout, jangan langsung logout
  const handleLogout = () => {
    navigate("/logout");
  };

  /**
   * GENERATE COLOR PALETTE UNTUK AVATAR
   */
  const getAvatarColors = (email) => {
    const hash = email.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const palettes = [
      ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
      ["#FFAD08", "#EDD75A", "#73B06F", "#0C8F8F", "#405059"],
      ["#6B7A8F", "#F7882F", "#F7C331", "#DCC7AA", "#A7C5BD"],
      ["#D9D9D9", "#A6A6A6", "#8C8C8C", "#595959", "#404040"],
      ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
    ];

    return palettes[Math.abs(hash) % palettes.length];
  };

  const avatarColors = getAvatarColors(userEmail);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-2">
      {/* KIRI - BREADCRUMB & SIDEBAR TOGGLE */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-muted text-foreground p-0 h-8 w-8 flex items-center justify-center"
        >
          {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </Button>

        <Breadcrumb>
          <BreadcrumbList>
            {pathnames.map((name, idx) => {
              const routeTo = "/" + pathnames.slice(0, idx + 1).join("/");
              const isLast = idx === pathnames.length - 1;

              return (
                <div key={routeTo} className="flex items-center">
                  {idx !== 0 && <BreadcrumbSeparator />}
                  {isLast ? (
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">
                        {formatBreadcrumb(name)}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to={routeTo} className="capitalize">
                          {formatBreadcrumb(name)}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* KANAN - THEME & USER PROFILE */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <Popover>
          <PopoverTrigger>
            <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer flex items-center justify-center bg-accent">
              <Avatar
                size={32}
                name={userEmail}
                variant="initials"
                colors={avatarColors}
              />
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="w-56 p-0"
            side="bottom"
            align="end"
            sideOffset={8}
          >
            <div className="flex items-center gap-3 p-4 border-b bg-background">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Avatar
                  size={40}
                  name={userEmail}
                  variant="initials"
                  colors={avatarColors}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-foreground truncate" title={userEmail}>
                  {userEmail}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-4 py-2"
                onClick={handleLogout} 
              >
                <LogOut size={16} />
                Sign out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}