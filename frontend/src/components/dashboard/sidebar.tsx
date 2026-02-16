"use client";

import { cn } from "@/src/lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { LogOut, SquareChevronLeft, SquareChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashRoutes } from "@/src/lib/data/dash-sidebar";
import { useState } from "react";

export function DashSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "space-y-4 py-4 flex flex-col h-full bg-white relative z-10 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="px-3 py-2 flex-1">
        <div
          className={`group relative flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } mb-5`}
        >
          {isCollapsed ? (
            <h1 className="font-bold text-lg">D</h1>
          ) : (
            <Link href="/" className="flex items-center space-x-3">
              <h1 className="font-bold text-lg">Dashboard</h1>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
            transition-opacity duration-200 cursor-e-resize
            ${isCollapsed ? "opacity-0 group-hover:opacity-100 absolute right-3" : ""}
            `}
          >
            {isCollapsed ? (
              <SquareChevronRight className="h-8 w-8" />
            ) : (
              <SquareChevronLeft className="h-8 w-8" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {dashRoutes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant={pathname === route.href ? "secondary" : "ghost"}
                size={isCollapsed ? "icon" : "default"}
                className={cn(
                  "w-full font-base rounded-sm",
                  isCollapsed ? "justify-center" : "justify-start",
                  pathname === route.href
                    ? "bg-primary hover:bg-primary text-white font-bold"
                    : "hover:bg-primary hover:text-white",
                )}
                title={isCollapsed ? route.label : undefined}
              >
                <Link href={route.href}>
                  <route.icon
                    className={cn("h-5 w-5", !isCollapsed && "mr-3")}
                  />
                  {!isCollapsed && (
                    <span className="text-sm">{route.label}</span>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="px-3 py-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full hover:bg-red-500 cursor-pointer hover:text-white rounded-sm",
            isCollapsed ? "justify-center px-2" : "justify-start",
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
