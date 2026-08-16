"use client";

import { CellAction } from "./cell-action";

export type QuizColumn = {
  id: number;
  title: string;
  slug: string;
  status: string;
  isActive: boolean;
  pointsReward: number;
  timeLimitSeconds: number | null;
  questionCount: number;
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
    accessorKey: "questionCount",
    header: "Questions",
  },
  {
    accessorKey: "pointsReward",
    header: "Points",
  },
  {
    accessorKey: "timeLimitSeconds",
    header: "Time limit",
    cell: ({ row }) =>
      row.original.timeLimitSeconds
        ? `${row.original.timeLimitSeconds}s`
        : "None",
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
