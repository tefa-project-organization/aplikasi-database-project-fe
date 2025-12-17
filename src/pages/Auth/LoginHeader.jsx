import React from "react";
import { Link } from "react-router-dom";
import LoginTheme from "./LoginTheme";
import { useTheme } from "@/context/ThemeContext";
import WgsIconBlack from "@/assets/icon/logo_wgs_fullBlack.svg";
import WgsIconWhite from "@/assets/icon/logo_wgs_fullWhite.svg";

export default function LoginHeader() {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={theme === "dark" ? WgsIconWhite : WgsIconBlack}
              alt="Database Projects Logo"
              className="h-6 w-auto"
            />
            {/* <span className="text-lg font-semibold text-foreground">
              Database Projects
            </span> */}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LoginTheme />
        </div>
      </div>
    </header>
  );
}