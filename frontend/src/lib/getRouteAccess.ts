export type RouteType = "public" | "guest" | "protected" | "admin";

interface RouteConfig {
  type: RouteType;
  path: string;
}

export const routeAccess: RouteConfig[] = [
  // Public routes - accessible by everyone (logged in or not)
  { path: "/", type: "public" },
  { path: "/home", type: "public" },
  { path: "/about", type: "public" },
  { path: "/contact", type: "public" },

  // Guest routes - only for non-logged-in users
  { path: "/signin", type: "guest" },
  { path: "/signup", type: "guest" },

  // Protected routes - only for logged-in users
  { path: "/dashboard", type: "protected" },
  { path: "/dashboard/categories", type: "protected" },
  { path: "/dashboard/blogs", type: "protected" },
  { path: "/dashboard/stories", type: "protected" },
  { path: "/dashboard/settings", type: "protected" },
];

export function getRouteType(pathname: string): RouteType {
  const exactMatch = routeAccess.find((route) => route.path === pathname);
  if (exactMatch) return exactMatch.type;

  // Check for dynamic routes (e.g., /profile/123)
  const dynamicMatch = routeAccess.find((route) => {
    if (route.path.includes("[")) {
      // Convert /profile/[id] to /profile/*
      const pattern = route.path.replace(/\[.*?\]/g, ".*");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }

    // Check if pathname starts with route path (for nested routes)
    return pathname.startsWith(route.path + "/");
  });

  if (dynamicMatch) return dynamicMatch.type;

  return "public";
}
