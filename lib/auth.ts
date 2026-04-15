import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { toTokenBalance } from "@/lib/credits";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Test Account",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "reviewer@razorpay.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Hardcoded test user for Razorpay reviewer
                if (credentials?.email === "reviewer@razorpay.com" && credentials?.password === "Razorpay@123") {
                    return { id: "test_reviewer", email: "reviewer@razorpay.com", name: "Razorpay Reviewer" };
                }
                return null;
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" || account?.provider === "credentials") {
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
        async session({ session, token }) {
            if (!session.user?.email) return session;

            try {
                // Always fetch fresh data from DB to ensure session stays in sync with user's balance.
                const userData = await prisma.user.findUnique({
                    where: { email: session.user.email },
                    include: { credits: true },
                });

                if (userData) {
                    const sessionUser = session.user;
                    
                    // Prioritize database UUID over provider-supplied ID.
                    sessionUser.id = userData.id;
                    sessionUser.referralCode = userData.referralCode;
                    
                    if (userData.credits) {
                        sessionUser.credits = userData.credits;
                        sessionUser.tokenBalance = toTokenBalance(userData.credits);
                        sessionUser.tokens = sessionUser.tokenBalance.totalTokens;
                    } else {
                        // Backfill missing credits row for legacy users.
                        try {
                            const createdCredits = await prisma.userCredits.create({
                                data: {
                                    userId: userData.id,
                                    freeScriptsUsed: 0,
                                    paidCredits: 0,
                                    totalGenerated: 0,
                                },
                            });
                            sessionUser.credits = createdCredits;
                            sessionUser.tokenBalance = toTokenBalance(createdCredits);
                            sessionUser.tokens = sessionUser.tokenBalance.totalTokens;
                        } catch {
                            const existingCredits = await prisma.userCredits.findUnique({
                                where: { userId: userData.id },
                            });
                            if (existingCredits) {
                                sessionUser.credits = existingCredits;
                                sessionUser.tokenBalance = toTokenBalance(existingCredits);
                                sessionUser.tokens = sessionUser.tokenBalance.totalTokens;
                            }
                        }
                    }
                }
            } catch (error) {
                // Do not fail auth session when DB hydration is temporarily unavailable.
                console.error("Error hydrating session:", error);
            }

            return session;
        },
        async jwt({ token, user, trigger, session }) {
            // Initial sign-in: Attach database ID if possible.
            if (user) {
                // User object passed here is from the provider. 
                // We'll prioritize the database UUID if it exists (created in signIn callback).
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { email: user.email! }
                    });
                    token.id = dbUser ? dbUser.id : user.id;
                    token.referralCode = dbUser?.referralCode ?? null;
                } catch {
                    token.id = user.id;
                }
            }
            
            // Allow manual session updates to trigger a JWT refresh (though session callback handles DB sync).
            if (trigger === "update" && session) {
                // This allows us to push updates from the client using useSession().update()
                return { ...token, ...session };
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
