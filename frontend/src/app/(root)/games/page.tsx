import Link from "next/link";
import { HelpCircle, Layers } from "lucide-react";

const gameTiles = [
  {
    href: "/games/quiz",
    title: "Quizzes",
    description: "Test what you know with timed multiple-choice quizzes",
    icon: HelpCircle,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    href: "/games/flashcards",
    title: "Flashcards",
    description: "Swipe through cards to lock in what you're learning",
    icon: Layers,
    color: "text-violet-500 bg-violet-500/10",
  },
];

export default function GamesHub() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      <h1 className="text-2xl font-bold mb-1">Games</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Play, learn, and earn points
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gameTiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="flex flex-col gap-3 p-5 rounded-2xl border bg-card hover:border-primary transition-colors"
          >
            <div
              className={`h-11 w-11 rounded-full flex items-center justify-center ${tile.color}`}
            >
              <tile.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{tile.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {tile.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
