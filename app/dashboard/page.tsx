import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  await auth();

  return (
    <h1>Dashboard</h1>
  );
}
