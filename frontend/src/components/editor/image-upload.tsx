"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { handleError } from "@/src/lib/errors/handleError";

interface ImageUploadProps {
  images: Array<{ url: string; id: number }>;
  onAdd: (url: string, id: number) => void;
  onRemove: (index: number) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onAdd,
  onRemove,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    e.target.value = "";

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();

      onAdd(data.url, data.id);
      toast.success("Image uploaded successfully");
    } catch (error) {
      handleError(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label
          htmlFor="image-upload"
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            images.length >= maxImages || uploading
              ? "opacity-50 cursor-not-allowed bg-gray-100"
              : "cursor-pointer hover:bg-gray-50"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span className="text-sm">Upload Image</span>
            </>
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={uploading || images.length >= maxImages}
            className="hidden"
          />
        </label>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages} images
        </span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden border">
                <Image
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-400">
          <Upload className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
