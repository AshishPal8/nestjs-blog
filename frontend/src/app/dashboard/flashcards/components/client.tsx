"use client";

import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Separator } from "@/src/components/ui/separator";
import { DeckColumn, columns } from "./columns";
import React, { useEffect } from "react";
import DataTable from "@/src/components/ui/data-table";
import Pagination from "@/src/components/shared/pagination";
import { useQuery } from "@apollo/client/react";
import { GET_ADMIN_FLASHCARD_DECKS } from "@/src/graphql/queries/flashcards";
import { format } from "date-fns";

interface AdminFlashcardDecksResponse {
  adminFlashcardDecks: {
    data: DeckColumn[];
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

export const FlashcardDecksClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const { data, loading, refetch, error } =
    useQuery<AdminFlashcardDecksResponse>(GET_ADMIN_FLASHCARD_DECKS, {
      variables: { pagination: { page, limit } },
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    refetch({ pagination: { page, limit } });
  }, [page, limit, refetch]);

  const tableData: DeckColumn[] =
    data?.adminFlashcardDecks.data.map((deck) => ({
      id: deck.id,
      title: deck.title,
      slug: deck.slug,
      status: deck.status,
      isActive: deck.isActive,
      pointsReward: deck.pointsReward,
      cardCount: deck.cardCount,
      createdAt: format(deck.createdAt, "dd-MM-yyyy"),
    })) || [];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Flashcard Decks (${data?.adminFlashcardDecks.meta?.total ?? 0})`}
          description="Manage flashcard decks"
        />
        <Button onClick={() => router.push(`/dashboard/flashcards/new`)}>
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
          <p className="text-red-500">Error loading decks: {error.message}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <DataTable columns={columns} data={tableData} />
          {data?.adminFlashcardDecks.meta && (
            <Pagination
              currentPage={data.adminFlashcardDecks.meta.page}
              totalPages={data.adminFlashcardDecks.meta.totalPages}
            />
          )}
        </>
      )}
    </>
  );
};
