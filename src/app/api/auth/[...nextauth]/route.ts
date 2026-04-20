import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type SignInApiResponse = {
  token?: string;
  user?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  decoded?: {
    id?: string;
    name?: string;
    role?: string;
  };
};

const SIGN_IN_API_URL = "https://ecommerce.routemisr.com/api/v1/auth/signin";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim() ?? "";
        const password = credentials?.password ?? "";

        if (!email || !password) {
          return null;
        }

        const response = await fetch(SIGN_IN_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          cache: "no-store",
        });

        if (!response.ok) {
          return null;
        }

        const payload = (await response.json()) as SignInApiResponse;
        const user = payload.user;

        console.log("API Response User:", user);

        if (!payload.token || !user) {
          return null;
        }

        return {
          id: payload.decoded?.id ?? user._id ?? user.id ?? user.email,
          _id: user._id,
          decoded: payload.decoded,
          name: user.name ?? payload.decoded?.name ?? "",
          email: user.email ?? email,
          role: user.role ?? payload.decoded?.role ?? "user",
          accessToken: payload.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // عند تسجيل الدخول لأول مرة، نضع الـ ID في التوكن
      if (user) {
        // نحاول جلب الـ ID من كل المصادر الممكنة في رد الـ API
        token.id = user.id || user._id || (user as any).decoded?.id;
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      // ننقل الـ ID من التوكن إلى الجلسة (Session)
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
