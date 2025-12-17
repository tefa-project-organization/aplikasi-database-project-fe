import React from "react";
import { Link } from "react-router-dom";
import LoginTheme from "./LoginTheme";
import headerIcon from "@/assets/icon/header-icon.svg";

export default function LoginHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Logo dan Nama di kiri */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={headerIcon}
              alt="Database Projects Logo"
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold text-foreground">
              Database Projects
            </span>
          </Link>
        </div>

        {/* Theme Toggle di kanan */}
        <div className="flex items-center gap-4">
          <LoginTheme />
        </div>
      </div>
    </header>
  );
}