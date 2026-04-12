"use client";

import { useState } from "react";
import { UserProfile } from "@/src/types/user.types";
import SavedPosts from "./saved-posts";
import Image from "next/image";
import { CalendarDays, Globe, Pencil } from "lucide-react";
import { timeAgo } from "@/src/lib";
import EditProfileModal from "./edit-profile-modal";

const ProfileClient = ({ user }: { user: UserProfile }) => {
  const [activeTab, setActiveTab] = useState<"about" | "saved">("about");
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="w-full bg-card min-h-screen rounded-md">
      {/* ── Header ───────────────────────────────────── */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name ?? ""}
                width={72}
                height={72}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 text-sm border rounded-full px-3 py-1.5 hover:bg-muted transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit profile
          </button>
        </div>

        <h1 className="text-xl font-bold">{user.name ?? "Anonymous"}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>

        {user.bio && <p className="text-sm mt-2 leading-relaxed">{user.bio}</p>}

        <div className="flex flex-wrap items-center gap-3 mt-3">
          {user.website && (
            <a // ✅ fixed — was missing
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Globe className="h-3.5 w-3.5" />
              {user.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            Joined {timeAgo(user.createdAt)}
          </span>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────── */}
      <div className="flex border-b">
        {(["about", "saved"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors relative ${
              activeTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "about" ? "About" : "Saved"}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ──────────────────────────────── */}
      <div>
        {activeTab === "about" && (
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              {user.name && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground w-16 shrink-0">
                    Name
                  </span>
                  <span>{user.name}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground w-16 shrink-0">
                  Email
                </span>
                <span>{user.email}</span>
              </div>
              {user.bio && (
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-muted-foreground w-16 shrink-0">
                    Bio
                  </span>
                  <span className="leading-relaxed">{user.bio}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground w-16 shrink-0">
                    Website
                  </span>
                  <a // ✅ fixed — was missing
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              )}
            </div>

            {!user.bio && !user.website && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Your profile is looking a bit empty.
                </p>
                <button
                  onClick={() => setEditOpen(true)}
                  className="text-sm text-primary mt-1 hover:underline"
                >
                  Add a bio
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && <SavedPosts />}
      </div>

      <EditProfileModal
        user={user}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
};

export default ProfileClient;
