"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { ImageUpload } from "./image-upload";
import { PostEditor } from "./tiptap-editor";
import { TagInput } from "../ui/tag-input";
import { CREATE_POST } from "@/src/graphql/mutations/posts";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { handleGraphqlError } from "@/src/lib/errors/handleGraphqlErrors";
import { Button } from "../ui/button";
import { MultiSelect } from "../ui/multi-select";
import { GET_ACTIVE_CATEGORIES } from "@/src/graphql/queries/categories";

const DRAFT_KEY = "create-post-draft";

export default function CreatePostForm({ onClose }: { onClose?: () => void }) {
  const getFirst50Words = (html: string): string => {
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.split(" ").slice(0, 50).join(" ");
  };

  const getInitialDraft = () => {
    if (typeof window === "undefined") return null;

    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const initialDraft = getInitialDraft();

  const [formData, setFormData] = useState(
    initialDraft?.formData || {
      title: "",
      description: "",
      metaDescription: "",
      categoryIds: [] as number[],
      tags: [] as string[],
    },
  );

  const [images, setImages] = useState<{ url: string; id: number }[]>(
    initialDraft?.images || [],
  );
  const [imageIds, setImageIds] = useState<number[]>(
    initialDraft?.imageIds || [],
  );
  const [draftSaved, setDraftSaved] = useState(false);

  const isFirstLoad = useRef(true);

  const { data: categoriesData } = useQuery(GET_ACTIVE_CATEGORIES);
  const categoryOptions = (categoriesData?.activeCategories ?? []).map(
    (cat: { id: number; name: string }) => ({
      value: String(cat.id),
      label: cat.name,
    }),
  );

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      toast.success("Post created successfully");
      localStorage.removeItem(DRAFT_KEY);
      onClose?.();
      resetForm();
    },
    onError: handleGraphqlError,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      metaDescription: "",
      categoryIds: [],
      tags: [],
    });
    setImages([]);
    setImageIds([]);
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const handler = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ formData, images, imageIds }),
      );

      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 1200);
    }, 600);

    return () => clearTimeout(handler);
  }, [formData, images, imageIds]);

  console.log("draftSaved", draftSaved);

  const handleAddImage = (url: string, id: number) => {
    setImages((prev) => [...prev, { url, id }]);
    setImageIds((prev) => [...prev, id]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageIds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createPost({
      variables: {
        input: {
          title: formData.title,
          description: formData.description,
          metaDescription: formData.metaDescription,
          categoryIds: formData.categoryIds,
          tags: formData.tags,
          imageIds: imageIds,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {draftSaved ? (
        <div className="absolute right-0 -top-6 text-xs text-muted-foreground">
          Saving...
        </div>
      ) : (
        <div className="absolute right-0 -top-6 text-xs text-muted-foreground">
          Saved
        </div>
      )}
      <MultiSelect
        options={categoryOptions}
        value={formData.categoryIds.map(String)}
        onValueChange={(vals) =>
          setFormData((prev) => ({
            ...prev,
            categoryIds: vals.map(Number),
          }))
        }
        placeholder="Select categories..."
      />

      <Input
        placeholder="Post title..."
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
        className="text-2xl font-semibold border-none shadow-none focus-visible:ring-0 px-0"
      />

      <PostEditor
        value={formData.description}
        onChange={(html) =>
          setFormData((prev) => ({
            ...prev,
            description: html,
            metaDescription: getFirst50Words(html),
          }))
        }
      />

      <TagInput
        value={formData.tags}
        onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
      />

      <ImageUpload
        images={images}
        onAdd={handleAddImage}
        onRemove={handleRemoveImage}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
}
