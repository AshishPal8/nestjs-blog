"use client";

import { CellAction } from "./cell-action";

export type DeckColumn = {
  id: number;
  title: string;
  slug: string;
  status: string;
  isActive: boolean;
  pointsReward: number;
  cardCount: number;
  createdAt: string;
};

export const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs ${
          row.original.status === "published"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {row.original.status === "published" ? "Published" : "Draft"}
      </span>
    ),
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
    accessorKey: "cardCount",
    header: "Cards",
  },
  {
    accessorKey: "pointsReward",
    header: "Points",
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
