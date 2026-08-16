import React, { Suspense } from "react";
import { QuizzesClient } from "./components/client";

export default async function Quizzes() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <Suspense fallback={<div>Loading...</div>}>
          <QuizzesClient />
        </Suspense>
      </div>
    </div>
  );
}
