import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "@src/lib/postgres";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { clearStaleTokens } from "@src/lib/auth/clearStaleTokenServerAction";
import { setName } from "@src/lib/auth/setNameServerAction";
import { updateUserImage } from "@src/lib/auth/imageUploadServerAction";

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
		verifyRequest: "/auth/auth-success",
		error: "/auth/auth-error",
	},
	providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Nodemailer({
        	server: {
        		host: process.env.EMAIL_SERVER_HOST,
        		port: parseInt(process.env.EMAIL_SERVER_PORT, 10),
        		auth: {
        			user: process.env.EMAIL_SERVER_USER,
        			pass: process.env.EMAIL_SERVER_PASSWORD,
        		}
        	},
        	from: process.env.EMAIL_FROM,
        })
    ],
	callbacks: {
		async jwt({token, user, session, trigger}){
			if (trigger === "update" && session?.name != token.name){
				token.name = session.name;
				try{
					await setName(token.name);
				} catch(error) {
					console.error("Failed to set user name: ", error);
				}
			}

			if (trigger === "update" && session?.image !== token.image) {
			    token.image = session.image;
			    try {
			        if (typeof token.image === "string" && token.image.trim() !== "") {
			            await updateUserImage(token.image);
			        } else {
			            console.warn("Skipping update: Image URL is invalid");
			        }
			    } catch (error) {
			        console.error("Failed to update user image: ", error);
			    }
			}


			if (user) {
				await clearStaleTokens();
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