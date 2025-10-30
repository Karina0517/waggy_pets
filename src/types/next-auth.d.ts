import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: "admin" | "user";
  }

  interface Session extends DefaultSession {
    user: {
      name?: string | null;
      email?: string | null;
      role?: "admin" | "user";
    };
  }

  interface JWT {
    role?: "admin" | "user";
  }
}
