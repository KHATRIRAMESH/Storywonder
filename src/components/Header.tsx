"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Menu, LogOut, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, isSignedIn, isBackendUser, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const newIsScrolled = scrollTop > 50;

      if (newIsScrolled !== isScrolled) {
        setIsScrolled(newIsScrolled);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const optimizedHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", optimizedHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", optimizedHandleScroll);
  }, [isScrolled]);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md shadow-sm transition-all duration-300 ${
        isScrolled ? "backdrop-blur-lg shadow-lg" : ""
      }`}
      style={{
        background: isScrolled
          ? `linear-gradient(135deg, ${getComputedStyle(
              document.documentElement
            ).getPropertyValue("--background")} 0%, #2A3A4F 50%, #262B49 100%)`
          : `linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(42, 58, 79, 0.85) 50%, rgba(38, 43, 73, 0.85) 100%)`,
        opacity: isScrolled ? "0.98" : "0.92",
      }}
    >
      <nav
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled ? "py-2" : "py-1"
        }`}
      >
        <div
          className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? "h-14" : "h-16"
          }`}
        >
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div
                className={`rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 ${
                  isScrolled ? "w-8 h-8" : "w-10 h-10"
                }`}
                style={{
                  background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                }}
              >
                <BookOpen
                  className={`text-white transition-all duration-300 ${
                    isScrolled ? "w-4 h-4" : "w-6 h-6"
                  }`}
                />
              </div>
              <span
                className={`font-bold shiny-text transition-all duration-300 ${
                  isScrolled ? "text-lg" : "text-xl"
                }`}
              >
                StoryWonderbook
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex items-center transition-all duration-300 ${
              isScrolled ? "space-x-4" : "space-x-6"
            }`}
          >
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className={`text-light hover:text-white hover:opacity-80 font-medium nav-button transition-all duration-300 hover:bg-white hover:bg-opacity-10 ${
                      isScrolled ? "text-sm px-3 py-2" : "text-base px-4 py-2"
                    }`}
                  >
                    My Stories
                  </Button>
                </Link>
                <Link href="/create-story">
                  <Button
                    variant="ghost"
                    className={`text-light hover:text-white hover:opacity-80 font-medium nav-button transition-all duration-300 hover:bg-white hover:bg-opacity-10 ${
                      isScrolled ? "text-sm px-3 py-2" : "text-base px-4 py-2"
                    }`}
                  >
                    Create Story
                  </Button>
                </Link>
                {user?.isAdmin && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      className={`text-light hover:text-white hover:opacity-80 font-medium nav-button transition-all duration-300 hover:bg-white hover:bg-opacity-10 ${
                        isScrolled ? "text-sm px-3 py-2" : "text-base px-4 py-2"
                      }`}
                    >
                      Admin Panel
                    </Button>
                  </Link>
                )}

                {/* User Profile Section */}
                <div
                  className={`flex items-center pl-4 border-l transition-all duration-300 ${
                    isScrolled ? "space-x-2" : "space-x-3"
                  }`}
                  style={{ borderColor: "var(--primary)" }}
                >
                  <div className="flex flex-col text-right">
                    <span
                      className={`font-medium text-light transition-all duration-300 ${
                        isScrolled ? "text-xs" : "text-sm"
                      }`}
                    >
                      {user?.firstName || "User"}
                    </span>
                    <span
                      className={`text-light opacity-70 capitalize transition-all duration-300 ${
                        isScrolled ? "text-xs hidden" : "text-xs"
                      }`}
                    >
                      {user?.plan || "free"} plan •{" "}
                      {user?.storiesUsed || 0} stories used
                    </span>
                  </div>
                  {isBackendUser ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`relative rounded-full transition-all duration-300 ${
                            isScrolled ? "w-8 h-8" : "w-10 h-10"
                          }`}
                        >
                          <Avatar
                            className={isScrolled ? "w-8 h-8" : "w-10 h-10"}
                          >
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user?.firstName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                      >
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user?.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: isScrolled ? "w-8 h-8" : "w-10 h-10",
                          userButtonPopoverCard: "magical-card shadow-xl",
                          userButtonPopoverActionButton: "hover:bg-opacity-80",
                        },
                      }}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="#features"
                  className={`text-light hover:text-white opacity-80 hover:opacity-100 transition-all duration-300 hover:bg-white hover:bg-opacity-10 rounded-lg px-3 py-2 ${
                    isScrolled ? "text-sm" : "text-base"
                  }`}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className={`text-light hover:text-white opacity-80 hover:opacity-100 transition-all duration-300 hover:bg-white hover:bg-opacity-10 rounded-lg px-3 py-2 ${
                    isScrolled ? "text-sm" : "text-base"
                  }`}
                >
                  Pricing
                </a>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className={`text-light rounded-lg hover:text-white nav-button transition-all duration-300 hover:bg-white hover:bg-opacity-10 ${
                      isScrolled ? "text-sm px-3 py-2" : "text-base px-4 py-2"
                    }`}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    variant="ghost"
                    className={`text-light rounded-lg hover:text-white nav-button transition-all duration-300 hover:bg-white hover:bg-opacity-10 ${
                      isScrolled ? "text-sm px-3 py-2" : "text-base px-4 py-2"
                    }`}
                  >
                    Start Creating
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {!isSignedIn && (
              <Link href="/sign-up">
                <Button
                  className={`btn-primary text-white shadow-lg transition-all duration-300 ${
                    isScrolled ? "text-xs px-3 py-1" : "text-sm px-4 py-2"
                  }`}
                >
                  Sign Up
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              className={`p-2 transition-all duration-300 hover:bg-white hover:bg-opacity-10 ${
                isScrolled ? "p-1" : "p-2"
              }`}
            >
              <Menu
                className={`text-light transition-all duration-300 ${
                  isScrolled ? "w-5 h-5" : "w-6 h-6"
                }`}
              />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
