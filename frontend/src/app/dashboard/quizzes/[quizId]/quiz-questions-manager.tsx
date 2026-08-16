"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Pencil, Plus, Trash, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  ADD_QUIZ_QUESTION,
  DELETE_QUIZ_QUESTION,
  UPDATE_QUIZ_QUESTION,
} from "@/src/graphql/mutations/quizzes";
import { handleGraphqlError } from "@/src/lib/errors/handleGraphqlErrors";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string | null;
}

interface QuizQuestionsManagerProps {
  quizId: number;
  questions: QuizQuestion[];
  onChanged: () => void;
}

type QuestionDraft = {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

const emptyDraft = (): QuestionDraft => ({
  question: "",
  options: ["", ""],
  correctOptionIndex: 0,
  explanation: "",
});

const draftFromQuestion = (q: QuizQuestion): QuestionDraft => ({
  question: q.question,
  options: [...q.options],
  correctOptionIndex: q.correctOptionIndex,
  explanation: q.explanation ?? "",
});

interface QuestionEditorProps {
  draft: QuestionDraft;
  setDraft: React.Dispatch<React.SetStateAction<QuestionDraft>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  saveLabel: string;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  draft,
  setDraft,
  onSave,
  onCancel,
  saving,
  saveLabel,
}) => {
  const updateOption = (index: number, value: string) => {
    setDraft((d) => ({
      ...d,
      options: d.options.map((o, i) => (i === index ? value : o)),
    }));
  };

  const addOption = () => {
    if (draft.options.length >= 8) return;
    setDraft((d) => ({ ...d, options: [...d.options, ""] }));
  };

  const removeOption = (index: number) => {
    if (draft.options.length <= 2) return;
    setDraft((d) => {
      const options = d.options.filter((_, i) => i !== index);
      const correctOptionIndex =
        d.correctOptionIndex >= options.length
          ? options.length - 1
          : d.correctOptionIndex;
      return { ...d, options, correctOptionIndex };
    });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Textarea
          placeholder="Question text"
          value={draft.question}
          onChange={(e) =>
            setDraft((d) => ({ ...d, question: e.target.value }))
          }
          rows={2}
        />

        <div className="space-y-2">
          {draft.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct-option"
                checked={draft.correctOptionIndex === i}
                onChange={() =>
                  setDraft((d) => ({ ...d, correctOptionIndex: i }))
                }
                className="shrink-0"
              />
              <Input
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
              />
              {draft.options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8"
                  onClick={() => removeOption(i)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {draft.options.length < 8 && (
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              <Plus className="h-4 w-4 mr-1" /> Add option
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            Select the radio button next to the correct answer
          </p>
        </div>

        <Textarea
          placeholder="Explanation (optional, shown after answering)"
          value={draft.explanation}
          onChange={(e) =>
            setDraft((d) => ({ ...d, explanation: e.target.value }))
          }
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
};

const validateDraft = (draft: QuestionDraft) => {
  const question = draft.question.trim();
  const options = draft.options.map((o) => o.trim());

  if (!question) return toast.error("Question text is required"), null;
  if (options.some((o) => !o))
    return toast.error("All options must be filled in"), null;
  if (draft.correctOptionIndex >= options.length)
    return toast.error("Select a valid correct answer"), null;

  return {
    question,
    options,
    correctOptionIndex: draft.correctOptionIndex,
    explanation: draft.explanation.trim() || undefined,
  };
};

export const QuizQuestionsManager: React.FC<QuizQuestionsManagerProps> = ({
  quizId,
  questions,
  onChanged,
}) => {
  const [draft, setDraft] = useState(emptyDraft());
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [addQuestion, { loading: addLoading }] = useMutation(
    ADD_QUIZ_QUESTION,
    {
      onCompleted: () => {
        toast.success("Question added");
        setDraft(emptyDraft());
        setAdding(false);
        onChanged();
      },
      onError: (error) =>
        toast.error(error.message || "Failed to add question"),
    },
  );

  const [updateQuestion, { loading: updateLoading }] = useMutation(
    UPDATE_QUIZ_QUESTION,
    {
      onCompleted: () => {
        toast.success("Question updated");
        setDraft(emptyDraft());
        setEditingId(null);
        onChanged();
      },
      onError: (error) =>
        toast.error(error.message || "Failed to update question"),
    },
  );

  const [deleteQuestion] = useMutation(DELETE_QUIZ_QUESTION, {
    onCompleted: () => {
      toast.success("Question removed");
      onChanged();
    },
    onError: () => toast.error("Failed to delete question"),
  });

  const startAdd = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setAdding(true);
  };

  const startEdit = (q: QuizQuestion) => {
    setAdding(false);
    setDraft(draftFromQuestion(q));
    setEditingId(q.id);
  };

  const cancelEditor = () => {
    setAdding(false);
    setEditingId(null);
    setDraft(emptyDraft());
  };

  const handleAdd = async () => {
    const input = validateDraft(draft);
    if (!input) return;

    try {
      await addQuestion({ variables: { quizId, input } });
    } catch (error) {
      handleGraphqlError(error);
    }
  };

  const handleUpdate = async () => {
    if (editingId === null) return;
    const input = validateDraft(draft);
    if (!input) return;

    try {
      await updateQuestion({ variables: { questionId: editingId, input } });
    } catch (error) {
      handleGraphqlError(error);
    }
  };

  const handleDelete = async (questionId: number) => {
    try {
      await deleteQuestion({ variables: { questionId } });
    } catch (error) {
      handleGraphqlError(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Questions ({questions.length})
        </h3>
        {!adding && editingId === null && (
          <Button size="sm" onClick={startAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add question
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) =>
          editingId === q.id ? (
            <QuestionEditor
              key={q.id}
              draft={draft}
              setDraft={setDraft}
              onSave={handleUpdate}
              onCancel={cancelEditor}
              saving={updateLoading}
              saveLabel="Save changes"
            />
          ) : (
            <Card key={q.id} className="py-0">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => startEdit(q)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDelete(q.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 rounded ${
                        i === q.correctOptionIndex
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
                {q.explanation && (
                  <p className="text-xs text-muted-foreground">
                    Explanation: {q.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          ),
        )}
      </div>

      {adding && (
        <QuestionEditor
          draft={draft}
          setDraft={setDraft}
          onSave={handleAdd}
          onCancel={cancelEditor}
          saving={addLoading}
          saveLabel="Save question"
        />
      )}
    </div>
  );
};
