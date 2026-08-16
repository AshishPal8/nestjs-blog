import { FileText } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";

export default function Stories() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
            <div>
              <p className="font-medium">Stories is coming soon</p>
              <p className="text-sm text-muted-foreground">
                This section isn&apos;t built yet — check back later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
