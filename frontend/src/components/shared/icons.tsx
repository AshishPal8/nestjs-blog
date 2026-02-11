import {
  Home,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export type Icon = LucideIcon;

export const Icons = {
  login: LogIn,
  search: Search,
  menu: Menu,
  logout: LogOut,
  home: Home,
  settings: Settings,
  user: User,

  logo: ({ className, ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
      {...props}
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  ),
};

interface IconProps extends LucideProps {
  name: keyof typeof Icons;
}

export const IconComponent = ({ name, className, ...props }: IconProps) => {
  const Icon = Icons[name];
  return <Icon className={cn("size-4", className)} {...props} />;
};
