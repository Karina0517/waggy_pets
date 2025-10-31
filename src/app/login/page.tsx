import { Suspense } from "react";
import LoginForm from "../ui/login-form";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-gray-50">
      <div className="mx-auto flex w-full max-w-[400px] flex-col space-y-4 p-4 m-4 py-10">
        <div className="flex h-20 w-full items-end rounded-lg bg-[#93f62885] p-3 md:h-36 justify-center">
          <h1 className="text-[#1e380285] text-2xl font-bold">Mi App</h1>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
