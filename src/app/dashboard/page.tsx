import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Bienvenido, {session.user.name}</h1>
      <p className="mt-2 text-gray-600">Has iniciado sesión correctamente ✅</p>
    </main>
  );
}
