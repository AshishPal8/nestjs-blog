"use client";
import { CategoryForm } from "./category-form";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORY_BY_ID } from "@/src/graphql/queries/categories";

interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface CategoryResponse {
  category: Category;
}

const CategoryPage = () => {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const isNew = categoryId === "new";

  const { data, loading, error } = useQuery<CategoryResponse>(
    GET_CATEGORY_BY_ID,
    {
      variables: {
        id: parseInt(categoryId),
      },
      skip: isNew,
    },
  );

  if (isNew) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CategoryForm initialData={null} />
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

  if (error || !data?.category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <CategoryForm
          initialData={{
            id: data.category.id,
            name: data.category.name,
            description: data.category.description,
            isActive: data.category.isActive,
          }}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
