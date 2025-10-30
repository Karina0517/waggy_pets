"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setMsg("✅ Usuario registrado correctamente");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMsg(data.error || "❌ Error al registrar");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl mb-4">Registro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
        <input placeholder="Nombre" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Contraseña" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-blue-600 text-white py-1 rounded">Registrarse</button>
      </form>
      {msg && <p className="mt-2">{msg}</p>}
    </div>
  );
}
