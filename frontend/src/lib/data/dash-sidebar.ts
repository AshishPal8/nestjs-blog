import {
  LayoutDashboard,
  Tag,
  FileText,
  Settings,
  HelpCircle,
  Layers,
} from "lucide-react";

export const dashRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Categories",
    icon: Tag,
    href: "/dashboard/categories",
  },
  {
    label: "Blogs",
    icon: FileText,
    href: "/dashboard/blogs",
  },
  {
    label: "Quizzes",
    icon: HelpCircle,
    href: "/dashboard/quizzes",
  },
  {
    label: "Flashcards",
    icon: Layers,
    href: "/dashboard/flashcards",
  },
  {
    label: "Stories",
    icon: FileText,
    href: "/dashboard/stories",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];
