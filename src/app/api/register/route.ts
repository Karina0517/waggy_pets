import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "../../lib/dbConnection";

export async function POST(request: Request) {
  await connectDB(); 

  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
const newUser = await User.create({ name, email, password: hashed, role: "user" });
  return NextResponse.json({ ok: true, message: "Usuario creado correctamente", userId: newUser._id });
}
