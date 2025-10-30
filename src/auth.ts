import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "../auth.config";
import { z } from "zod";
import bcrypt from "bcrypt"; 
import { connectDB } from "@/app/lib/dbConnection";
import User from "@/models/User";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        await connectDB();
        const user = await User.findOne({ email }).lean();

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
