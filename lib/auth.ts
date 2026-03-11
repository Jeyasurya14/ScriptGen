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

            try {
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
            } catch (error) {
                // Do not fail auth session when DB hydration is temporarily unavailable.
                console.error("Error hydrating session:", error);
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
            const appUrl = `${baseUrl}/app`;

            // Allows relative callback URLs.
            // Treat root callback as post-login app landing page.
            if (url.startsWith("/")) {
                return url === "/" ? appUrl : `${baseUrl}${url}`;
            }

            // Allows callback URLs on the same origin.
            try {
                const parsedUrl = new URL(url);
                if (parsedUrl.origin === baseUrl) {
                    const isRootPath =
                        parsedUrl.pathname === "/" &&
                        !parsedUrl.search &&
                        !parsedUrl.hash;
                    return isRootPath ? appUrl : url;
                }
            } catch {
                // Fall through to safe default below.
            }

            // Safe default after auth.
            return appUrl;
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
