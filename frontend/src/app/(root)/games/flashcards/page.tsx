import Link from "next/link";
import Image from "next/image";
import { Layers, Award } from "lucide-react";
import { query } from "@/src/lib/apollo-server-client";
import { GET_FLASHCARD_DECKS } from "@/src/graphql/queries/flashcards";

interface Deck {
  id: number;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  cardCount: number;
  pointsReward: number;
}

interface FlashcardDecksData {
  flashcardDecks: Deck[];
}

const FlashcardDecksListPage = async () => {
  let decks: Deck[] = [];

  try {
    const { data } = await query<FlashcardDecksData>({
      query: GET_FLASHCARD_DECKS,
    });
    decks = data?.flashcardDecks ?? [];
  } catch {
    decks = [];
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      <h1 className="text-2xl font-bold mb-1">Flashcards</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Swipe through a deck to lock in what you&apos;re learning
      </p>

      {decks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Layers className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            No flashcard decks available yet — check back soon
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {decks.map((deck) => (
            <Link
              key={deck.id}
              href={`/games/flashcards/${deck.slug}`}
              className="flex flex-col rounded-2xl border bg-card overflow-hidden hover:border-primary transition-colors"
            >
              {deck.imageUrl && (
                <div className="relative w-full aspect-video">
                  <Image
                    src={deck.imageUrl}
                    alt={deck.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <p className="font-semibold leading-snug line-clamp-2">
                  {deck.title}
                </p>
                {deck.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {deck.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span>{deck.cardCount} cards</span>
                  <span className="flex items-center gap-1 ml-auto text-primary">
                    <Award className="h-3.5 w-3.5" />
                    {deck.pointsReward} pts
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardDecksListPage;
