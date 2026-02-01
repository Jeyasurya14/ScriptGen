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
                        const newUser = await prisma.user.create({
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
                (session.user as any).id = userData.id;
                if (userData.credits) {
                    (session.user as any).credits = userData.credits;
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
    },
    pages: {
        signIn: "/",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
