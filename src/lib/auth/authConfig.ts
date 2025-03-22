import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "@src/lib/postgres";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
	trustHost: true,
	adapter: PostgresAdapter(pool),
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // user will be logged in for max 30 days
	},
	pages: {
		signIn: "/auth/sign-in",
	},
	providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
	callbacks: {
		async jwt({token, user}){
			if (user) {
				return {
					...token,
					id: user.id,
				}
			}
			return token;
		},
		async session({ session, token }){
			console.log("Session callback", { session, token });
			return{
				...session,
				user: {
					...session.user,
					id: token.id as string,
				}
			}
		}
	}
})