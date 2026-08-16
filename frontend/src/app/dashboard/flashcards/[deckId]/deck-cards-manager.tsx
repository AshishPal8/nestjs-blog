"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Pencil, Plus, Trash } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  ADD_FLASHCARD_CARD,
  DELETE_FLASHCARD_CARD,
  UPDATE_FLASHCARD_CARD,
} from "@/src/graphql/mutations/flashcards";
import { handleGraphqlError } from "@/src/lib/errors/handleGraphqlErrors";

interface FlashcardCard {
  id: number;
  front: string;
  back: string;
}

interface DeckCardsManagerProps {
  deckId: number;
  cards: FlashcardCard[];
  onChanged: () => void;
}

interface CardDraft {
  front: string;
  back: string;
}

const emptyDraft = (): CardDraft => ({ front: "", back: "" });

interface CardEditorProps {
  draft: CardDraft;
  setDraft: React.Dispatch<React.SetStateAction<CardDraft>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  saveLabel: string;
}

const CardEditor: React.FC<CardEditorProps> = ({
  draft,
  setDraft,
  onSave,
  onCancel,
  saving,
  saveLabel,
}) => (
  <Card>
    <CardContent className="p-4 space-y-3">
      <Textarea
        placeholder="Front (question/term)"
        value={draft.front}
        onChange={(e) => setDraft((d) => ({ ...d, front: e.target.value }))}
        rows={2}
      />
      <Textarea
        placeholder="Back (answer/definition)"
        value={draft.back}
        onChange={(e) => setDraft((d) => ({ ...d, back: e.target.value }))}
        rows={2}
      />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" disabled={saving} onClick={onSave}>
          {saveLabel}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export const DeckCardsManager: React.FC<DeckCardsManagerProps> = ({
  deckId,
  cards,
  onChanged,
}) => {
  const [draft, setDraft] = useState<CardDraft>(emptyDraft());
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [addCard, { loading: addLoading }] = useMutation(ADD_FLASHCARD_CARD, {
    onCompleted: () => {
      toast.success("Card added");
      setDraft(emptyDraft());
      setAdding(false);
      onChanged();
    },
    onError: (error) => toast.error(error.message || "Failed to add card"),
  });

  const [updateCard, { loading: updateLoading }] = useMutation(
    UPDATE_FLASHCARD_CARD,
    {
      onCompleted: () => {
        toast.success("Card updated");
        setDraft(emptyDraft());
        setEditingId(null);
        onChanged();
      },
      onError: (error) => toast.error(error.message || "Failed to update card"),
    },
  );

  const [deleteCard] = useMutation(DELETE_FLASHCARD_CARD, {
    onCompleted: () => {
      toast.success("Card removed");
      onChanged();
    },
    onError: () => toast.error("Failed to delete card"),
  });

  const startAdd = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setAdding(true);
  };

  const startEdit = (c: FlashcardCard) => {
    setAdding(false);
    setDraft({ front: c.front, back: c.back });
    setEditingId(c.id);
  };

  const cancelEditor = () => {
    setAdding(false);
    setEditingId(null);
    setDraft(emptyDraft());
  };

  const handleAdd = async () => {
    if (!draft.front.trim() || !draft.back.trim()) {
      return toast.error("Both front and back are required");
    }

    try {
      await addCard({
        variables: {
          deckId,
          input: { front: draft.front.trim(), back: draft.back.trim() },
        },
      });
    } catch (error) {
      handleGraphqlError(error);
    }
  };

  const handleUpdate = async () => {
    if (editingId === null) return;
    if (!draft.front.trim() || !draft.back.trim()) {
      return toast.error("Both front and back are required");
    }

    try {
      await updateCard({
        variables: {
          cardId: editingId,
          input: { front: draft.front.trim(), back: draft.back.trim() },
        },
      });
    } catch (error) {
      handleGraphqlError(error);
    }
  };

  const handleDelete = async (cardId: number) => {
    try {
      await deleteCard({ variables: { cardId } });
    } catch (error) {
      handleGraphqlError(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cards ({cards.length})</h3>
        {!adding && editingId === null && (
          <Button size="sm" onClick={startAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add card
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((c) =>
          editingId === c.id ? (
            <CardEditor
              key={c.id}
              draft={draft}
              setDraft={setDraft}
              onSave={handleUpdate}
              onCancel={cancelEditor}
              saving={updateLoading}
              saveLabel="Save changes"
            />
          ) : (
            <Card key={c.id}>
              <CardContent className="p-4 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">{c.front}</p>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => startEdit(c)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{c.back}</p>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      {adding && (
        <CardEditor
          draft={draft}
          setDraft={setDraft}
          onSave={handleAdd}
          onCancel={cancelEditor}
          saving={addLoading}
          saveLabel="Save card"
        />
      )}
    </div>
  );
};
