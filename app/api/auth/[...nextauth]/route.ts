import { authOptions } from "@/next-auth-config";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions)

export { handler as DELETE, handler as GET, handler as POST };

