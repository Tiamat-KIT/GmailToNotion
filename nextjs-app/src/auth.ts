import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { env } from "./env.d"

export const {handlers,signIn,signOut,auth} = NextAuth({
    secret: env.AUTH_SECRET,
    providers: [Google({
        clientId: env.AUTH_GOOGLE_ID,
        clientSecret: env.AUTH_GOOGLE_SECRET,
        authorization: {
            params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
                scope: ["https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/calendar.readonly"].join(" "),
            }
        }
    })],
    callbacks: {
        jwt: async ({token, user, account}) => {
            if (user) {
                token.user = user;
                const u = user as any
                token.role = u.role;
            }
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
            }
            return token;
        },
        session: ({session, token}) => {
            token.accessToken
            return {
                ...session,
                user: {
                    ...session.user,
                    role: token.role,
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                },

            };
        },
    }
})