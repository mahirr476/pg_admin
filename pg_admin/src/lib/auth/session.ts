// src/lib/auth/session.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "./config";
import { Session } from "@/types/user";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions) as Session | null;
  return session?.user;
}
