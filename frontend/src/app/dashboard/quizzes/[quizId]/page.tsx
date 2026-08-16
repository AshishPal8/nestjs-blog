"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { QuizForm } from "./quiz-form";
import { QuizQuestionsManager } from "./quiz-questions-manager";
import { GET_ADMIN_QUIZ_DETAIL } from "@/src/graphql/queries/quizzes";
import { PUBLISH_QUIZ } from "@/src/graphql/mutations/quizzes";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { handleGraphqlError } from "@/src/lib/errors/handleGraphqlErrors";

interface AdminQuizDetail {
  adminQuizDetail: {
    quiz: {
      id: number;
      title: string;
      slug: string;
      description?: string;
      categoryId: number;
      imageId?: number;
      imageUrl?: string;
      sourceText?: string;
      status: string;
      isActive: boolean;
      pointsReward: number;
      timeLimitSeconds?: number;
      questionCount: number;
    };
    questions: {
      id: number;
      question: string;
      options: string[];
      correctOptionIndex: number;
      explanation?: string;
      orderIndex: number;
    }[];
  };
}

const QuizDetailPage = () => {
  const params = useParams();
  const quizId = params.quizId as string;
  const isNew = quizId === "new";

  const { data, loading, error, refetch } = useQuery<AdminQuizDetail>(
    GET_ADMIN_QUIZ_DETAIL,
    {
      variables: { id: parseInt(quizId) },
      skip: isNew,
      fetchPolicy: "network-only",
    },
  );

  const [publishQuiz, { loading: publishLoading }] = useMutation(
    PUBLISH_QUIZ,
    {
      onCompleted: () => {
        toast.success("Quiz published");
        refetch();
      },
      onError: (error) => toast.error(error.message || "Failed to publish"),
    },
  );

  const handlePublish = async () => {
    try {
      await publishQuiz({ variables: { id: parseInt(quizId) } });
    } catch (error) {
      handleGraphqlError(error);
    }
  };

  if (isNew) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <QuizForm initialData={null} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !data?.adminQuizDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Quiz not found</h1>
      </div>
    );
  }

  const { quiz, questions } = data.adminQuizDetail;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <QuizForm
          initialData={{
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            categoryId: quiz.categoryId,
            imageId: quiz.imageId,
            imageUrl: quiz.imageUrl,
            sourceText: quiz.sourceText,
            pointsReward: quiz.pointsReward,
            timeLimitSeconds: quiz.timeLimitSeconds,
            isActive: quiz.isActive,
          }}
        />

        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded ${
              quiz.status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {quiz.status === "published" ? "Published" : "Draft"}
          </span>
          {quiz.status !== "published" && (
            <Button
              disabled={publishLoading || questions.length === 0}
              onClick={handlePublish}
            >
              Publish quiz
            </Button>
          )}
        </div>
        <Separator />

        <QuizQuestionsManager
          quizId={quiz.id}
          questions={questions}
          onChanged={() => refetch()}
        />
      </div>
    </div>
  );
};

export default QuizDetailPage;
