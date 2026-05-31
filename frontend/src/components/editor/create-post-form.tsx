"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { ImageUpload } from "./image-upload";
import { PostEditor } from "./tiptap-editor";
import { TagInput } from "../ui/tag-input";
import { CREATE_POST } from "@/src/graphql/mutations/posts";
import { UPDATE_POST } from "@/src/graphql/mutations/posts";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { handleGraphqlError } from "@/src/lib/errors/handleGraphqlErrors";
import { Button } from "../ui/button";
import { MultiSelect } from "../ui/multi-select";
import { GET_ACTIVE_CATEGORIES } from "@/src/graphql/queries/categories";
import { Icons } from "../shared/icons";
import { useRouter } from "next/navigation";

const DRAFT_KEY = "create-post-draft";

interface InitialPostData {
  id: number;
  title: string;
  description: string;
  tags: string[];
  categoryIds: number[];
  images: { url: string; id: number }[];
}

interface CreatePostFormProps {
  onClose?: () => void;
  initialData?: InitialPostData | null;
}

export default function CreatePostForm({ onClose, initialData }: CreatePostFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const getMetaDescription = (html: string): string => {
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, 255);
  };

  const getInitialDraft = () => {
    if (isEditMode || typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const initialDraft = getInitialDraft();

  const [formData, setFormData] = useState(
    initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          categoryIds: initialData.categoryIds,
          tags: initialData.tags,
        }
      : initialDraft?.formData || {
          title: "",
          description: "",
          categoryIds: [] as number[],
          tags: [] as string[],
        },
  );

  const [editorKey, setEditorKey] = useState(0);
  const [images, setImages] = useState<{ url: string; id: number }[]>(
    initialData?.images ?? initialDraft?.images ?? [],
  );
  const [imageIds, setImageIds] = useState<number[]>(
    initialData?.images.map((img) => img.id) ?? initialDraft?.imageIds ?? [],
  );
  const [draftSaved, setDraftSaved] = useState(false);
  const [hasDraft, setHasDraft] = useState(() => {
    if (isEditMode || typeof window === "undefined") return false;
    return !!localStorage.getItem(DRAFT_KEY);
  });

  const isFirstLoad = useRef(true);

  const { data: categoriesData } = useQuery(GET_ACTIVE_CATEGORIES);
  const categoryOptions = (categoriesData?.activeCategories ?? []).map(
    (cat: { id: number; name: string }) => ({
      value: String(cat.id),
      label: cat.name,
    }),
  );

  const [createPost, { loading: createLoading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      toast.success("Post created successfully");
      localStorage.removeItem(DRAFT_KEY);
      onClose?.();
      resetForm();
    },
    onError: handleGraphqlError,
  });

  const [updatePost, { loading: updateLoading }] = useMutation(UPDATE_POST, {
    onCompleted: () => {
      toast.success("Post updated successfully");
      router.push("/dashboard/blogs");
      router.refresh();
    },
    onError: handleGraphqlError,
  });

  const loading = createLoading || updateLoading;

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      categoryIds: [],
      tags: [],
    });
    setImages([]);
    setImageIds([]);
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setEditorKey((k) => k + 1);
  };

  useEffect(() => {
    if (isEditMode) return;
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
      setHasDraft(true);
      setTimeout(() => setDraftSaved(false), 1200);
    }, 600);

    return () => clearTimeout(handler);
  }, [formData, images, imageIds, isEditMode]);

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

    if (isEditMode) {
      updatePost({
        variables: {
          id: initialData!.id,
          input: {
            title: formData.title,
            description: formData.description,
            metaDescription: getMetaDescription(formData.description),
            categoryIds: formData.categoryIds,
            tags: formData.tags,
            imageIds: imageIds,
          },
        },
      });
    } else {
      createPost({
        variables: {
          input: {
            title: formData.title,
            description: formData.description,
            metaDescription: getMetaDescription(formData.description),
            categoryIds: formData.categoryIds,
            tags: formData.tags,
            imageIds: imageIds,
          },
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {!isEditMode && (
        <div className="absolute right-0 -top-6 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {draftSaved ? "Saving..." : ""}
          </span>
          {hasDraft && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Clear draft
            </button>
          )}
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
        key={editorKey}
        value={formData.description}
        onChange={(html) =>
          setFormData((prev) => ({
            ...prev,
            description: html,
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
        {loading ? (
          <Icons.loader className="h-4 w-4 animate-spin" />
        ) : isEditMode ? (
          <Icons.check className="h-4 w-4" />
        ) : (
          <Icons.plus className="h-4 w-4" />
        )}
        {loading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update Post"
          : "Create Post"}
      </Button>
    </form>
  );
}
