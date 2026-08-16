"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client/react";
import { Layers, Award, X, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { GET_FLASHCARD_DECK_PLAY } from "@/src/graphql/queries/flashcards";
import { SUBMIT_FLASHCARD_ATTEMPT } from "@/src/graphql/mutations/flashcards";
import { useAuthStore } from "@/src/store/auth-store";
import { useLoginModal } from "@/src/store/useLoginModal";
import { CoinIcon } from "@/src/assets";
import { toast } from "sonner";

interface FlashcardCard {
  id: number;
  front: string;
  back: string;
}

interface FlashcardDeckPlayData {
  flashcardDeck: {
    deck: {
      id: number;
      title: string;
      description?: string;
      imageUrl?: string;
      pointsReward: number;
      cardCount: number;
    };
    cards: FlashcardCard[];
    alreadyCompleted: boolean;
  };
}

type Stage = "intro" | "playing" | "results";

const SWIPE_THRESHOLD = 100;

const FlashcardDeckPlayPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const user = useAuthStore((state) => state.user);
  const loginModal = useLoginModal();

  const { data, loading } = useQuery<FlashcardDeckPlayData>(
    GET_FLASHCARD_DECK_PLAY,
    { variables: { slug } },
  );

  const [stage, setStage] = useState<Stage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [animatingOut, setAnimatingOut] = useState<"left" | "right" | null>(
    null,
  );
  const [knownCount, setKnownCount] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [firstCompletion, setFirstCompletion] = useState(false);

  const pointerStartX = useRef<number | null>(null);
  const pointerMoved = useRef(false);
  const knownCountRef = useRef(0);

  const [submitAttempt] = useMutation(SUBMIT_FLASHCARD_ATTEMPT);

  const deck = data?.flashcardDeck.deck;
  const cards = data?.flashcardDeck.cards ?? [];
  const alreadyCompleted = data?.flashcardDeck.alreadyCompleted ?? false;

  const handleStart = () => {
    if (!user) {
      loginModal.onOpen();
      return;
    }
    if (alreadyCompleted) return;
    setCurrentIndex(0);
    setKnownCount(0);
    knownCountRef.current = 0;
    setFlipped(false);
    setStage("playing");
  };

  const finishDeck = async (finalKnownCount: number) => {
    if (!deck) return;
    try {
      const { data: res } = await submitAttempt({
        variables: {
          input: {
            deckId: deck.id,
            knownCount: finalKnownCount,
            totalCards: cards.length,
          },
        },
      });
      setPointsEarned(res.submitFlashcardAttempt.pointsEarned);
      setFirstCompletion(res.submitFlashcardAttempt.firstCompletion);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save your result",
      );
    }
    setKnownCount(finalKnownCount);
    setStage("results");
  };

  const advance = (know: boolean) => {
    const nextKnownCount = knownCountRef.current + (know ? 1 : 0);
    knownCountRef.current = nextKnownCount;
    setKnownCount(nextKnownCount);

    if (currentIndex >= cards.length - 1) {
      finishDeck(nextKnownCount);
      return;
    }

    setCurrentIndex((i) => i + 1);
    setFlipped(false);
    setDragX(0);
    setAnimatingOut(null);
  };

  const triggerSwipe = (direction: "left" | "right") => {
    setAnimatingOut(direction);
    setDragX(direction === "right" ? 600 : -600);
    setTimeout(() => advance(direction === "right"), 250);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (animatingOut) return;
    pointerStartX.current = e.clientX;
    pointerMoved.current = false;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    if (Math.abs(delta) > 5) pointerMoved.current = true;
    setDragX(delta);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);

    if (!pointerMoved.current) {
      setFlipped((f) => !f);
      setDragX(0);
      return;
    }

    if (dragX > SWIPE_THRESHOLD) {
      triggerSwipe("right");
    } else if (dragX < -SWIPE_THRESHOLD) {
      triggerSwipe("left");
    } else {
      setDragX(0);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <Layers className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="font-semibold">Deck not found</p>
        <Button
          variant="link"
          onClick={() => router.push("/games/flashcards")}
          className="mt-2"
        >
          Back to flashcards
        </Button>
      </div>
    );
  }

  if (stage === "intro") {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 sm:py-10">
        {deck.imageUrl && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4">
            <Image
              src={deck.imageUrl}
              alt={deck.title}
              fill
              className="object-cover"
              sizes="512px"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold mb-2">{deck.title}</h1>
        {deck.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {deck.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span>{deck.cardCount} cards</span>
          <span className="flex items-center gap-1 text-primary">
            <Award className="h-4 w-4" />
            {deck.pointsReward} pts
          </span>
        </div>
        {alreadyCompleted ? (
          <Button
            variant="destructive"
            className="w-full h-12 text-base rounded-xl"
            disabled
          >
            <CheckCircle2 className="h-4 w-4" />
            Already Played
          </Button>
        ) : (
          <Button
            className="w-full h-12 text-base rounded-xl"
            onClick={handleStart}
          >
            {user ? "Start" : "Login to play"}
          </Button>
        )}
      </div>
    );
  }

  if (stage === "playing") {
    const card = cards[currentIndex];
    const rotation = dragX / 20;
    const opacity = 1 - Math.min(Math.abs(dragX) / 400, 0.6);

    return (
      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-6 text-sm text-muted-foreground">
          <span>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span>{knownCount} known</span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-muted mb-8 overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${((currentIndex + 1) / cards.length) * 100}%`,
            }}
          />
        </div>

        <div
          className="w-full aspect-4/5 max-w-xs select-none cursor-grab active:cursor-grabbing touch-none"
          style={{
            transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
            opacity,
            transition: dragging ? "none" : "transform 250ms ease, opacity 250ms ease",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div className="w-full h-full rounded-2xl border-2 bg-card shadow-sm flex items-center justify-center p-6 text-center">
            <p className="text-lg font-semibold">
              {flipped ? card.back : card.front}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Tap to flip &middot; Swipe or use the buttons below
        </p>

        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={() => triggerSwipe("left")}
            className="h-14 w-14 rounded-full border-2 border-destructive/30 text-destructive flex items-center justify-center hover:bg-destructive/10 transition-colors"
            aria-label="Still learning"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={() => triggerSwipe("right")}
            className="h-14 w-14 rounded-full border-2 border-green-500/30 text-green-600 flex items-center justify-center hover:bg-green-500/10 transition-colors"
            aria-label="I know this"
          >
            <Check className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  }

  // results
  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:py-10 text-center">
      <p className="text-sm text-muted-foreground">You knew</p>
      <p className="text-4xl font-bold my-1">
        {knownCount}/{cards.length}
      </p>
      <div className="flex items-center justify-center gap-1.5 mt-3 mb-8">
        <Image src={CoinIcon} alt="Points" width={18} height={18} />
        <span className="font-semibold">
          {firstCompletion
            ? `+${pointsEarned} points`
            : "Already completed — no points this time"}
        </span>
      </div>
      <Button
        variant="outline"
        className="w-full h-12 rounded-xl"
        onClick={() => router.push("/games/flashcards")}
      >
        Back to flashcards
      </Button>
    </div>
  );
};

export default FlashcardDeckPlayPage;
