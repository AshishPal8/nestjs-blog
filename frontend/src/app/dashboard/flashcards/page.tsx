import React, { Suspense } from "react";
import { FlashcardDecksClient } from "./components/client";

export default async function Flashcards() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <Suspense fallback={<div>Loading...</div>}>
          <FlashcardDecksClient />
        </Suspense>
      </div>
    </div>
  );
}
