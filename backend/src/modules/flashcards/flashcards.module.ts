import { Module } from "@nestjs/common";
import { FlashcardsResolver } from "./flashcards.resolver";
import { FlashcardsService } from "./flashcards.service";
import { ActivityModule } from "@modules/activity/activity.module";

@Module({
  imports: [ActivityModule],
  providers: [FlashcardsResolver, FlashcardsService],
  exports: [FlashcardsService],
})
export class FlashcardsModule {}
