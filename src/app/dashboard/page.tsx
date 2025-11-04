// app/dashboard/page.tsx (o donde tengas tu dashboard)
import { auth } from "@/auth";
import { DashboardActions } from "../../components/ui/dashboard/DashboardActions";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido al panel de control</p>
      
      <DashboardActions />
    </div>
  );
} 