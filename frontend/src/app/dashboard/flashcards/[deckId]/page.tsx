"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { DeckForm } from "./deck-form";
import { DeckCardsManager } from "./deck-cards-manager";
import { GET_ADMIN_FLASHCARD_DECK_DETAIL } from "@/src/graphql/queries/flashcards";
import { PUBLISH_FLASHCARD_DECK } from "@/src/graphql/mutations/flashcards";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { handleGraphqlError } from "@/src/lib/errors/handleGraphqlErrors";

interface AdminFlashcardDeckDetail {
  adminFlashcardDeckDetail: {
    deck: {
      id: number;
      title: string;
      slug: string;
      description?: string;
      categoryId: number;
      imageId?: number;
      imageUrl?: string;
      sourceText?: string;
      status: string;
      isActive: boolean;
      pointsReward: number;
      cardCount: number;
    };
    cards: { id: number; front: string; back: string; orderIndex: number }[];
  };
}

const FlashcardDeckDetailPage = () => {
  const params = useParams();
  const deckId = params.deckId as string;
  const isNew = deckId === "new";

  const { data, loading, error, refetch } = useQuery<AdminFlashcardDeckDetail>(
    GET_ADMIN_FLASHCARD_DECK_DETAIL,
    {
      variables: { id: parseInt(deckId) },
      skip: isNew,
      fetchPolicy: "network-only",
    },
  );

  const [publishDeck, { loading: publishLoading }] = useMutation(
    PUBLISH_FLASHCARD_DECK,
    {
      onCompleted: () => {
        toast.success("Deck published");
        refetch();
      },
      onError: (error) => toast.error(error.message || "Failed to publish"),
    },
  );

  const handlePublish = async () => {
    try {
      await publishDeck({ variables: { id: parseInt(deckId) } });
    } catch (error) {
      handleGraphqlError(error);
    }
  };

  if (isNew) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <DeckForm initialData={null} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !data?.adminFlashcardDeckDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Deck not found</h1>
      </div>
    );
  }

  const { deck, cards } = data.adminFlashcardDeckDetail;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <DeckForm
          initialData={{
            id: deck.id,
            title: deck.title,
            description: deck.description,
            categoryId: deck.categoryId,
            imageId: deck.imageId,
            imageUrl: deck.imageUrl,
            sourceText: deck.sourceText,
            pointsReward: deck.pointsReward,
            isActive: deck.isActive,
          }}
        />

        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded ${
              deck.status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {deck.status === "published" ? "Published" : "Draft"}
          </span>
          {deck.status !== "published" && (
            <Button
              disabled={publishLoading || cards.length === 0}
              onClick={handlePublish}
            >
              Publish deck
            </Button>
          )}
        </div>
        <Separator />

        <DeckCardsManager
          deckId={deck.id}
          cards={cards}
          onChanged={() => refetch()}
        />
      </div>
    </div>
  );
};

export default FlashcardDeckDetailPage;
