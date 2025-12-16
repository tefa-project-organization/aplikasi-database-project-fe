import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen, Sun, Moon, User, LogOut } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function formatBreadcrumb(name) {
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Header() {
  const { open, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((p) => p);

  const [darkMode, setDarkMode] = React.useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-2">

      {/* kiri */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-muted p-0 h-8 w-8 flex items-center justify-center"
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

      {/* kanan */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <Popover>
          <PopoverTrigger>
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarFallback>NK</AvatarFallback>
            </Avatar>
          </PopoverTrigger>

          <PopoverContent className="w-56 p-0" side="bottom" align="end" sideOffset={8}>
            <div className="flex items-center gap-3 p-4 border-b bg-background">
              <Avatar className="w-10 h-10">
                <AvatarFallback>NK</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">John Doe</span>
                <span className="text-xs text-muted-foreground">
                  JohnDoe@email.com
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <Button variant="ghost" className="w-full justify-start gap-2 px-4 py-2">
                <User size={16} /> Manage Account
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-4 py-2"
                onClick={() => navigate("/logout")}
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
