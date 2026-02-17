"use client";

import { CellAction } from "./cell-action";

export type CategoryColumn = {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
};

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs ${
          row.original.isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "Action",
    header: "Action",
    render: (row) => <CellAction data={row} />,
  },
];
