import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(initialSearch);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchValue) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      const newUrl = `?${params.toString()}`;

      if (newUrl !== `?${searchParams.toString()}`) {
        router.push(newUrl);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue, searchParams, router]);

  return (
    <div className="w-full">
      <Input
        placeholder="Search with category name"
        className="w-full md:w-[30%]"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
