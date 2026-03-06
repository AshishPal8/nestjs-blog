import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Icons } from "../components/shared/icons";
import Image from "next/image";
import { Facebook, LinkedIn, Whatsapp, X } from "../assets";

const ShareModal = ({
  open,
  onClose,
  slug,
}: {
  open: boolean;
  onClose: () => void;
  slug: string;
}) => {
  const [copied, setCopied] = useState(false);
  const postUrl =
    typeof window !== "undefined" ? `${window.location.origin}/p/${slug}` : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (social: "facebook" | "whatsapp" | "x" | "linkedin") => {
    let url = "";

    switch (social) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;

      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(postUrl)}`;
        break;

      case "x":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`;
        break;

      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;

      default:
        return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription className="flex items-center gap-8 mt-4">
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={copyLink}
            >
              {copied ? (
                <Icons.check
                  size={40}
                  className="bg-green-500 text-white rounded-full p-1"
                />
              ) : (
                <Icons.copy size={40} />
              )}
              <span className="text-muted-foreground text-xs">
                {copied ? "Copied" : "Copy link"}
              </span>
            </div>
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => handleShare("facebook")}
            >
              <Image src={Facebook} alt="Facebook" width={40} height={40} />
              <span className="text-muted-foreground text-xs">Facebook</span>
            </div>
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => handleShare("whatsapp")}
            >
              <Image src={Whatsapp} alt="Whatsapp" width={40} height={40} />
              <span className="text-muted-foreground text-xs">Whatsapp</span>
            </div>
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => handleShare("x")}
            >
              <Image src={X} alt="X" width={40} height={40} />
              <span className="text-muted-foreground text-xs">X</span>
            </div>
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => handleShare("linkedin")}
            >
              <Image src={LinkedIn} alt="LinkedIn" width={40} height={40} />
              <span className="text-muted-foreground text-xs">LinkedIn</span>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
