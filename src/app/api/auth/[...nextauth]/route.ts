import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "../../../lib/dbConnection";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
        async authorize(credentials: Record<string, unknown> | undefined) {
        await connectDB();

        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) throw new Error("Faltan credenciales");

        const user = await User.findOne({ email });
        if (!user) throw new Error("Usuario no encontrado");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Contraseña incorrecta");

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role as "admin" | "user",
        };
        }
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token?.role) session.user.role = token.role;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirección según el rol
      if (url.startsWith("/dashboard")) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
