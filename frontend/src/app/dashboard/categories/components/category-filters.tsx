import React from "react";
import SearchInput from "@/src/components/shared/search-input";

const CategoryFilters = () => {
  return (
    <div className="flex items-center justify-between">
      <SearchInput />
      <div>Filters</div>
    </div>
  );
};

export default CategoryFilters;
