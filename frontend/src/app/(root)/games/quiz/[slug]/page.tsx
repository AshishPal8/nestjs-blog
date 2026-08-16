"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client/react";
import { Clock, Award, HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { GET_QUIZ_PLAY } from "@/src/graphql/queries/quizzes";
import {
  START_QUIZ_ATTEMPT,
  SUBMIT_QUIZ_ATTEMPT,
} from "@/src/graphql/mutations/quizzes";
import { useAuthStore } from "@/src/store/auth-store";
import { useLoginModal } from "@/src/store/useLoginModal";
import { CoinIcon } from "@/src/assets";
import { toast } from "sonner";

interface QuizPlayQuestion {
  id: number;
  question: string;
  options: string[];
  orderIndex: number;
}

interface QuizPlayData {
  quiz: {
    quiz: {
      id: number;
      title: string;
      description?: string;
      imageUrl?: string;
      pointsReward: number;
      timeLimitSeconds?: number;
      questionCount: number;
    };
    questions: QuizPlayQuestion[];
    alreadyCompleted: boolean;
  };
}

interface AnswerResult {
  questionId: number;
  selectedIndex: number;
  correctOptionIndex: number;
  correct: boolean;
  explanation?: string;
}

interface AttemptResult {
  score: number;
  totalQuestions: number;
  pointsEarned: number;
  firstCompletion: boolean;
  timedOut: boolean;
  answers: AnswerResult[];
}

type Stage = "intro" | "playing" | "results";

const QuizPlayPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const user = useAuthStore((state) => state.user);
  const loginModal = useLoginModal();

  const { data, loading } = useQuery<QuizPlayData>(GET_QUIZ_PLAY, {
    variables: { slug },
  });

  const [stage, setStage] = useState<Stage>("intro");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AttemptResult | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const [startAttempt, { loading: starting }] = useMutation(
    START_QUIZ_ATTEMPT,
  );
  const [submitAttempt, { loading: submitting }] = useMutation(
    SUBMIT_QUIZ_ATTEMPT,
  );

  const quiz = data?.quiz.quiz;
  const questions = data?.quiz.questions ?? [];
  const alreadyCompleted = data?.quiz.alreadyCompleted ?? false;

  const doSubmit = async (finalSessionId: number) => {
    if (submitting) return;
    try {
      const { data: res } = await submitAttempt({
        variables: {
          input: {
            sessionId: finalSessionId,
            answers: Object.entries(answersRef.current).map(
              ([questionId, selectedIndex]) => ({
                questionId: Number(questionId),
                selectedIndex,
              }),
            ),
          },
        },
      });
      setResult(res.submitQuizAttempt);
      setStage("results");
    } catch {
      // stay on the current question if submission fails; user can retry via Finish
    }
  };

  useEffect(() => {
    if (stage !== "playing" || !expiresAt || sessionId === null) return;

    const tick = () => {
      const secondsLeft = Math.round(
        (expiresAt.getTime() - Date.now()) / 1000,
      );
      setRemainingSeconds(Math.max(0, secondsLeft));

      if (secondsLeft <= 0) {
        clearInterval(interval);
        doSubmit(sessionId);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, expiresAt, sessionId]);

  const handleStart = async () => {
    if (!user) {
      loginModal.onOpen();
      return;
    }
    if (!quiz || alreadyCompleted) return;

    try {
      const { data: res } = await startAttempt({
        variables: { quizId: quiz.id },
      });
      setSessionId(res.startQuizAttempt.sessionId);
      setExpiresAt(
        res.startQuizAttempt.expiresAt
          ? new Date(res.startQuizAttempt.expiresAt)
          : null,
      );
      setCurrentIndex(0);
      setAnswers({});
      setStage("playing");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not start the quiz",
      );
    }
  };

  const handleSelect = (questionId: number, index: number) => {
    setAnswers((a) => ({ ...a, [questionId]: index }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else if (sessionId !== null) {
      doSubmit(sessionId);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <HelpCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="font-semibold">Quiz not found</p>
        <Button
          variant="link"
          onClick={() => router.push("/games/quiz")}
          className="mt-2"
        >
          Back to quizzes
        </Button>
      </div>
    );
  }

  if (stage === "intro") {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 sm:py-10">
        {quiz.imageUrl && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4">
            <Image
              src={quiz.imageUrl}
              alt={quiz.title}
              fill
              className="object-cover"
              sizes="512px"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {quiz.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span>{quiz.questionCount} questions</span>
          {quiz.timeLimitSeconds && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {quiz.timeLimitSeconds}s
            </span>
          )}
          <span className="flex items-center gap-1 text-primary">
            <Award className="h-4 w-4" />
            {quiz.pointsReward} pts
          </span>
        </div>
        {alreadyCompleted ? (
          <Button
            variant="destructive"
            className="w-full h-12 text-base rounded-xl"
            disabled
          >
            <CheckCircle2 className="h-4 w-4" />
            Already Played
          </Button>
        ) : (
          <Button
            className="w-full h-12 text-base rounded-xl"
            disabled={starting}
            onClick={handleStart}
          >
            {user ? "Start Quiz" : "Login to play"}
          </Button>
        )}
      </div>
    );
  }

  if (stage === "playing") {
    const question = questions[currentIndex];
    const selected = answers[question.id];

    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
          {remainingSeconds !== null && (
            <span
              className={`flex items-center gap-1 font-medium ${
                remainingSeconds <= 10 ? "text-destructive" : ""
              }`}
            >
              <Clock className="h-4 w-4" />
              {remainingSeconds}s
            </span>
          )}
        </div>

        <div className="w-full h-1.5 rounded-full bg-muted mb-6 overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <h2 className="text-lg font-semibold mb-5">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(question.id, i)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-colors text-sm sm:text-base ${
                selected === i
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-muted"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <Button
          className="w-full h-12 text-base rounded-xl mt-6"
          disabled={selected === undefined || submitting}
          onClick={handleNext}
        >
          {currentIndex < questions.length - 1 ? "Next" : "Finish"}
        </Button>
      </div>
    );
  }

  // results
  if (!result) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:py-10">
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">You scored</p>
        <p className="text-4xl font-bold my-1">
          {result.score}/{result.totalQuestions}
        </p>
        {result.timedOut && (
          <p className="text-xs text-destructive mt-1">
            Time ran out before you finished
          </p>
        )}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Image src={CoinIcon} alt="Points" width={18} height={18} />
          <span className="font-semibold">
            {result.firstCompletion
              ? `+${result.pointsEarned} points`
              : "Already completed — no points this time"}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {result.answers.map((a, idx) => {
          const question = questions.find((q) => q.id === a.questionId);
          if (!question) return null;
          return (
            <div key={a.questionId} className="rounded-xl border p-4 space-y-2">
              <div className="flex items-start gap-2">
                {a.correct ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                )}
                <p className="text-sm font-medium">
                  {idx + 1}. {question.question}
                </p>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Your answer: {question.options[a.selectedIndex]}
              </p>
              {!a.correct && (
                <p className="text-xs text-green-700 pl-6">
                  Correct answer: {question.options[a.correctOptionIndex]}
                </p>
              )}
              {a.explanation && (
                <p className="text-xs text-muted-foreground pl-6">
                  {a.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        className="w-full h-12 rounded-xl"
        onClick={() => router.push("/games/quiz")}
      >
        Back to quizzes
      </Button>
    </div>
  );
};

export default QuizPlayPage;
