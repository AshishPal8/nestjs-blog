import { DashSidebar } from "@/src/components/dashboard/sidebar";
import React from "react";

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden">
      <div className="shrink-0">
        <DashSidebar />
      </div>
      <main className="flex-1 overflow-y-auto bg-[#F9F9F9]">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
