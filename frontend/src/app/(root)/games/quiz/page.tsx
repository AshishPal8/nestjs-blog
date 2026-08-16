import Link from "next/link";
import Image from "next/image";
import { HelpCircle, Clock, Award } from "lucide-react";
import { query } from "@/src/lib/apollo-server-client";
import { GET_QUIZZES } from "@/src/graphql/queries/quizzes";

interface Quiz {
  id: number;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  questionCount: number;
  pointsReward: number;
  timeLimitSeconds?: number;
}

interface QuizzesData {
  quizzes: Quiz[];
}

const QuizListPage = async () => {
  let quizzes: Quiz[] = [];

  try {
    const { data } = await query<QuizzesData>({ query: GET_QUIZZES });
    quizzes = data?.quizzes ?? [];
  } catch {
    quizzes = [];
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      <h1 className="text-2xl font-bold mb-1">Quizzes</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Pick a quiz and test what you know
      </p>

      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <HelpCircle className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            No quizzes available yet — check back soon
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/games/quiz/${quiz.slug}`}
              className="flex flex-col rounded-2xl border bg-card overflow-hidden hover:border-primary transition-colors"
            >
              {quiz.imageUrl && (
                <div className="relative w-full aspect-video">
                  <Image
                    src={quiz.imageUrl}
                    alt={quiz.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <p className="font-semibold leading-snug line-clamp-2">
                  {quiz.title}
                </p>
                {quiz.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {quiz.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span>{quiz.questionCount} questions</span>
                  {quiz.timeLimitSeconds && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {quiz.timeLimitSeconds}s
                    </span>
                  )}
                  <span className="flex items-center gap-1 ml-auto text-primary">
                    <Award className="h-3.5 w-3.5" />
                    {quiz.pointsReward} pts
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizListPage;
