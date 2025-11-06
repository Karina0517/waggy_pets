import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/dbConnection";
import User from "@/models/User";
import { authConfig } from "../auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // Extiende la configuración base de auth.config.ts
  
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Mantenemos el callback authorized de authConfig
    ...authConfig.callbacks,
    
    // Agregamos los callbacks adicionales para JWT y Session
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Si es login con Google, verificar/crear usuario en la BD
      if (account?.provider === "google" && user) {
        await connectDB();
        
        let dbUser = await User.findOne({ email: user.email });
        
        if (!dbUser) {
          // Crear nuevo usuario si no existe
          dbUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            role: "user", // rol por defecto
          });
        }
        
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "user";
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});