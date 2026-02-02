import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                if (!user.email) return false;

                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                    });

                    if (!existingUser) {
                        await prisma.user.create({
                            data: {
                                email: user.email,
                                name: user.name,
                                image: user.image,
                                credits: {
                                    create: {
                                        freeScriptsUsed: 0,
                                        paidCredits: 0,
                                        totalGenerated: 0,
                                    },
                                },
                            },
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error during sign in:", error);
                    return true;
                }
            }
            return true;
        },
        async session({ session }) {
            if (!session.user?.email) return session;

            const userData = await prisma.user.findUnique({
                where: { email: session.user.email },
                include: { credits: true },
            });

            if (userData) {
                type SessionUserWithCredits = NonNullable<typeof session.user> & {
                    id?: string;
                    credits?: typeof userData.credits;
                };
                const sessionUser = session.user as SessionUserWithCredits;
                sessionUser.id = userData.id;
                if (userData.credits) {
                    sessionUser.credits = userData.credits;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    pages: {
        signIn: "/",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
