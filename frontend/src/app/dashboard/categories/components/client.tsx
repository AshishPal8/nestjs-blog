"use client";

import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Separator } from "@/src/components/ui/separator";
import { CategoryColumn, columns } from "./columns";
import React, { useEffect } from "react";
import DataTable from "@/src/components/ui/data-table";
import Pagination from "@/src/components/shared/pagination";
import CategoryFilters from "./category-filters";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "@/src/graphql/queries/categories";
import { format } from "date-fns";

interface CategoriesResponse {
  categories: {
    data: CategoryColumn[];
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
export const CategoryClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const { data, loading, refetch, error } = useQuery<CategoriesResponse>(
    GET_CATEGORIES,
    {
      variables: {
        paginationInput: {
          page,
          limit,
          search: search || undefined,
        },
      },
      fetchPolicy: "network-only",
    },
  );

  useEffect(() => {
    refetch({
      paginationInput: {
        page,
        limit,
        search: search || undefined,
      },
    });
  }, [page, limit, search, refetch]);

  const tableData: CategoryColumn[] =
    data?.categories.data.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      isActive: category.isActive || false,
      createdAt: format(category.createdAt, "dd-MM-yyyy"),
    })) || [];

  console.log("Columns", columns);
  console.log("Table Data", tableData);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Category (${data?.categories.meta?.total})`}
          description="Manage categories of blogs"
        />
        <Button onClick={() => router.push(`/dashboard/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <CategoryFilters />
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center py-10">
          <p className="text-red-500">
            Error loading categories: {error.message}
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <DataTable columns={columns} data={tableData} />
          {data?.categories.meta && (
            <Pagination
              currentPage={data.categories.meta.page}
              totalPages={data.categories.meta.totalPages}
            />
          )}
        </>
      )}
    </>
  );
};
