import { Module } from "@nestjs/common";
import { QuizzesResolver } from "./quizzes.resolver";
import { QuizzesService } from "./quizzes.service";
import { ActivityModule } from "@modules/activity/activity.module";

@Module({
  imports: [ActivityModule],
  providers: [QuizzesResolver, QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
