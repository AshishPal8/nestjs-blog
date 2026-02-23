import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { UploadService } from "./uploads.service";

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
