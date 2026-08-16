"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Heading } from "@/src/components/ui/heading";
import AlertModal from "@/src/modal/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ImageUpload } from "@/src/components/editor/image-upload";
import { Switch } from "@/src/components/ui/switch";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CREATE_FLASHCARD_DECK,
  UPDATE_FLASHCARD_DECK,
  DELETE_FLASHCARD_DECK,
} from "@/src/graphql/mutations/flashcards";
import { GET_ACTIVE_CATEGORIES } from "@/src/graphql/queries/categories";
import { handleGraphqlError } from "@/src/lib/errors/handleGraphqlErrors";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  categoryId: z.number({ error: "Category is required" }),
  sourceText: z.string().optional(),
  pointsReward: z.number().min(1).max(1000),
  isActive: z.boolean(),
});

type DeckFormValues = z.infer<typeof formSchema>;

interface DeckFormProps {
  initialData:
    | (DeckFormValues & { id: number; imageUrl?: string; imageId?: number })
    | null;
}

export const DeckForm: React.FC<DeckFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState<{ url: string; id: number } | null>(
    initialData?.imageUrl && initialData?.imageId
      ? { url: initialData.imageUrl, id: initialData.imageId }
      : null,
  );

  const title = initialData ? "Edit Flashcard Deck" : "Create Flashcard Deck";
  const description = initialData
    ? "Edit deck details, then manage its cards below"
    : "Create the deck, then add cards on the next screen";
  const action = initialData ? "Save changes" : "Create & continue";

  const { data: categoriesData } = useQuery<{
    activeCategories: { id: number; name: string; slug: string }[];
  }>(GET_ACTIVE_CATEGORIES);

  const form = useForm<DeckFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      sourceText: "",
      pointsReward: 10,
      isActive: true,
    },
  });

  const [createDeck, { loading: createLoading }] = useMutation(
    CREATE_FLASHCARD_DECK,
    {
      onCompleted: (data) => {
        toast.success("Deck created. Now add some cards.");
        router.push(`/dashboard/flashcards/${data.createFlashcardDeck.id}`);
        router.refresh();
      },
      onError: (error) => toast.error(error.message || "Error creating deck"),
    },
  );

  const [updateDeck, { loading: updateLoading }] = useMutation(
    UPDATE_FLASHCARD_DECK,
    {
      onCompleted: () => {
        toast.success("Deck updated.");
        router.refresh();
      },
      onError: (error) => toast.error(error.message || "Error updating deck"),
    },
  );

  const [deleteDeck, { loading: deleteLoading }] = useMutation(
    DELETE_FLASHCARD_DECK,
    {
      onCompleted: () => {
        toast.success("Deck deleted.");
        router.push(`/dashboard/flashcards`);
        router.refresh();
      },
      onError: () => toast.error("Failed to delete the deck."),
    },
  );

  const loading = createLoading || updateLoading || deleteLoading;

  const onSubmit = async (values: DeckFormValues) => {
    try {
      if (submitted) return;
      setSubmitted(true);

      if (initialData) {
        await updateDeck({
          variables: {
            id: parseInt(params.deckId as string),
            input: {
              title: values.title,
              description: values.description || undefined,
              categoryId: values.categoryId,
              imageId: image?.id,
              sourceText: values.sourceText || undefined,
              pointsReward: values.pointsReward,
              isActive: values.isActive,
            },
          },
        });
      } else {
        await createDeck({
          variables: {
            input: {
              title: values.title,
              description: values.description || undefined,
              categoryId: values.categoryId,
              imageId: image?.id,
              sourceText: values.sourceText || undefined,
              pointsReward: values.pointsReward,
            },
          },
        });
      }
    } catch (error) {
      handleGraphqlError(error);
    } finally {
      setSubmitted(false);
    }
  };

  const onDelete = async () => {
    try {
      await deleteDeck({ variables: { id: parseInt(params.deckId as string) } });
    } catch (error) {
      handleGraphqlError(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Enter deck title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(v) => field.onChange(parseInt(v))}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesData?.activeCategories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pointsReward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points reward</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {initialData && (
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                      <span className="text-sm text-muted-foreground">
                        {field.value
                          ? "Visible and playable by users"
                          : "Hidden from players, even if published"}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    {...field}
                    placeholder="Short description shown to players"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sourceText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source text (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    {...field}
                    placeholder="Paste article content here for reference while writing cards"
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Cover image</FormLabel>
            <ImageUpload
              images={image ? [image] : []}
              onAdd={(url, id) => setImage({ url, id })}
              onRemove={() => setImage(null)}
              maxImages={1}
            />
          </div>

          <Button
            disabled={loading || submitted}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
