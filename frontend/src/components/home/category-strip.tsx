"use client";
import React from "react";
import { GET_ACTIVE_CATEGORIES } from "@/src/graphql/queries/categories";
import { useQuery } from "@apollo/client/react";
import { ActiveCategoriesData, Category } from "@/src/types/category.types";
import Link from "next/link";

const CategoryStrip = () => {
  const { data: categoriesData } = useQuery<ActiveCategoriesData>(
    GET_ACTIVE_CATEGORIES,
  );
  const activeCategories = categoriesData?.activeCategories;

  return (
    <div className="bg-[#f5f6ff] py-2">
      <div className="w-full px-0 sm:px-5 lg:px-16 flex items-center gap-5">
        {activeCategories?.map((category: Category) => (
          <Link href={`/search?category=${category.slug}`} key={category.id}>
            <span className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryStrip;
