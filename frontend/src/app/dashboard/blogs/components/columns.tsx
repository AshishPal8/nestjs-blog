"use client";

import { CellAction } from "./cell-action";

export type PostColumn = {
  id: number;
  title: string;
  likesCount: string;
  commentsCount: string;
  isActive: boolean;
  createdAt: string;
};

export const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "likesCount",
    header: "Likes",
  },
  {
    accessorKey: "commentsCount",
    header: "Comments",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    // cell: ({ row }) => (
    //   <span
    //     className={`px-2 py-1 rounded text-xs ${
    //       row.original.isActive
    //         ? "bg-green-100 text-green-700"
    //         : "bg-red-100 text-red-700"
    //     }`}
    //   >
    //     {row.original.isActive ? "Active" : "Inactive"}
    //   </span>
    // ),
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
