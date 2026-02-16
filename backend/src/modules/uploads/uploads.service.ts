import { BadRequestError } from "@common/responses/custom-response";
import { imagekitInstance } from "@config/imagekit.config";
import { db } from "@database/db";
import { uploads } from "@database/schema/uploads.schema";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class UploadService {
  private readonly ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  private readonly ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

  async uploadFile(file: Express.Multer.File, userId: number) {
    const isImage = this.ALLOWED_IMAGE_TYPES.includes(file.mimetype);
    const isVideo = this.ALLOWED_VIDEO_TYPES.includes(file.mimetype);

    if (!isImage && !isVideo) {
      throw new BadRequestError("Invalid file type");
    }

    if (isImage && file.size > this.MAX_IMAGE_SIZE) {
      throw new BadRequestError(
        `Image too large. Max size: ${this.MAX_IMAGE_SIZE / 1024 / 1024}MB`,
      );
    }

    if (isVideo && file.size > this.MAX_VIDEO_SIZE) {
      throw new BadRequestError(
        `Video too large. Max size: ${this.MAX_VIDEO_SIZE / 1024 / 1024}MB`,
      );
    }

    try {
      const folder = isImage
        ? `/blogs/${userId}/images`
        : `/blogs/${userId}/videos`;

      const result = await imagekitInstance.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder,
      });

      const [upload] = await db
        .insert(uploads)
        .values({
          fileId: result.fileId,
          url: result.url,
          name: result.name,
          mimeType: file.mimetype,
          size: file.size,
          width: result.width || null,
          height: result.height || null,
          uploadBy: userId,
        })
        .returning();

      return upload;
    } catch (error) {
      console.error("Upload error:", error);
      throw new BadRequestException("Failed to upload file");
    }
  }
}
