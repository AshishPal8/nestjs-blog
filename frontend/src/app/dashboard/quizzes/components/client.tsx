"use client";

import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Separator } from "@/src/components/ui/separator";
import { QuizColumn, columns } from "./columns";
import React, { useEffect } from "react";
import DataTable from "@/src/components/ui/data-table";
import Pagination from "@/src/components/shared/pagination";
import { useQuery } from "@apollo/client/react";
import { GET_ADMIN_QUIZZES } from "@/src/graphql/queries/quizzes";
import { format } from "date-fns";

interface AdminQuizzesResponse {
  adminQuizzes: {
    data: QuizColumn[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export const QuizzesClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const { data, loading, refetch, error } = useQuery<AdminQuizzesResponse>(
    GET_ADMIN_QUIZZES,
    {
      variables: { pagination: { page, limit } },
      fetchPolicy: "network-only",
    },
  );

  useEffect(() => {
    refetch({ pagination: { page, limit } });
  }, [page, limit, refetch]);

  const tableData: QuizColumn[] =
    data?.adminQuizzes.data.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      slug: quiz.slug,
      status: quiz.status,
      isActive: quiz.isActive,
      pointsReward: quiz.pointsReward,
      timeLimitSeconds: quiz.timeLimitSeconds ?? null,
      questionCount: quiz.questionCount,
      createdAt: format(quiz.createdAt, "dd-MM-yyyy"),
    })) || [];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Quizzes (${data?.adminQuizzes.meta?.total ?? 0})`}
          description="Manage quizzes"
        />
        <Button onClick={() => router.push(`/dashboard/quizzes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center py-10">
          <p className="text-red-500">Error loading quizzes: {error.message}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <DataTable columns={columns} data={tableData} />
          {data?.adminQuizzes.meta && (
            <Pagination
              currentPage={data.adminQuizzes.meta.page}
              totalPages={data.adminQuizzes.meta.totalPages}
            />
          )}
        </>
      )}
    </>
  );
};
