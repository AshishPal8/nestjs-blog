import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UploadService } from "./uploads.service";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { BadRequestError } from "@common/responses/custom-response";

@Controller("uploads")
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new BadRequestError("No file provided");
    }

    const userId = req.user.id;
    return this.uploadService.uploadFile(file, userId);
  }
}
