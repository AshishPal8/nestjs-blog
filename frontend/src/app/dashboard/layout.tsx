import DashLayout from "@/src/components/dashboard/dash-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashLayout>{children}</DashLayout>;
}
