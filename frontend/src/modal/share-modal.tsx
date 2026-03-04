import React from "react";
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
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription className="flex items-center gap-8 mt-4">
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Icons.copy size={40} />
              <span className="text-muted-foreground text-xs">Copy link</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src={Facebook} alt="Facebook" width={40} height={40} />
              <span className="text-muted-foreground text-xs">Facebook</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src={Whatsapp} alt="Whatsapp" width={40} height={40} />
              <span className="text-muted-foreground text-xs">Whatsapp</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src={X} alt="X" width={40} height={40} />
              <span className="text-muted-foreground text-xs">X</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
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
