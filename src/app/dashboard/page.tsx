import { auth } from "@/auth"; // Tu configuración de NextAuth
import { redirect } from "next/navigation";
import { DashboardActions } from "@/components/ui/dashboard/DashboardActions";
import { AdminProductList } from "@/components/admin/AdminProductList";
import styles from "./dashboard.module.css"; // Asume estilos básicos de contenedor

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = session.user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar del Dashboard (Opcional) */}
      <nav className="bg-white shadow-sm p-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-green-700">
                Panel de Control {isAdmin && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">ADMIN</span>}
            </h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Hola, {session.user.name}</span>
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {isAdmin ? (
            /* VISTA DE ADMIN */
            <div className="space-y-6">
                <DashboardActions /> {/* Botones de logout/email */}
                <hr className="border-gray-200" />
                <AdminProductList /> {/* Tu nueva tabla CRUD */}
            </div>
        ) : (
            /* VISTA DE USUARIO NORMAL */
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4">Bienvenido a tu cuenta</h2>
                <p className="text-gray-600 mb-6">Desde aquí puedes gestionar tus pedidos y preferencias.</p>
                <DashboardActions />
                
                {/* Aquí podrías poner un historial de pedidos del usuario */}
                <div className="mt-10 p-10 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-400">Historial de pedidos próximamente...</p>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}