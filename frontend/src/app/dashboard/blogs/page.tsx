import React, { Suspense } from "react";
import { PostClient } from "./components/client";

export default async function Categories() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <Suspense fallback={<div>Loading...</div>}>
          <PostClient />
        </Suspense>
      </div>
    </div>
  );
}
