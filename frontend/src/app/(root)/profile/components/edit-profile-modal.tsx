"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PROFILE } from "@/src/graphql/mutations/user";
import { UserProfile } from "@/src/types/user.types";
import { useAuthStore } from "@/src/store/auth-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

const EditProfileModal = ({
  user,
  open,
  onClose,
}: {
  user: UserProfile;
  open: boolean;
  onClose: () => void;
}) => {
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({
    name: user.name ?? "",
    bio: user.bio ?? "",
    website: user.website ?? "",
  });

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, {
    onCompleted: (data) => {
      setUser(data.updateProfile);
      toast.success("Profile updated");
      onClose();
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ variables: { input: form } });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Tell readers about yourself..."
              rows={3}
              maxLength={500}
              className="w-full text-sm border rounded-md px-3 py-2 bg-transparent resize-none outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.bio.length}/500
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Website</label>
            <Input
              value={form.website}
              onChange={(e) =>
                setForm((p) => ({ ...p, website: e.target.value }))
              }
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
