import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "@/models/User";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: "nextauth_db" });

  const password = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Karina",
    email: "karina@example.com",
    password,
  });

  console.log("Usuario creado: karina@example.com / 123456");
  process.exit();
}

seed();
