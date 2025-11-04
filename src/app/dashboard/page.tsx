// app/dashboard/page.tsx (o donde tengas tu dashboard)
import { DashboardActions } from "../../components/ui/dashboard/DashboardActions";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido al panel de control</p>
      
      <DashboardActions />
    </div>
  );
}