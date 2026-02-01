import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn("Supabase not configured");
        return null;
    }

    return createClient(supabaseUrl, supabaseServiceKey);
};

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
                const supabase = getSupabase();
                if (!supabase) return true;

                try {
                    const { data: existingUser } = await supabase
                        .from("users")
                        .select("id")
                        .eq("email", user.email)
                        .single();

                    if (!existingUser) {
                        await supabase.from("users").insert({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                        });

                        const { data: newUser } = await supabase
                            .from("users")
                            .select("id")
                            .eq("email", user.email)
                            .single();

                        if (newUser) {
                            await supabase.from("user_credits").insert({
                                user_id: newUser.id,
                                free_scripts_used: 0,
                                paid_credits: 0,
                                total_generated: 0,
                            });
                        }
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
            const supabase = getSupabase();
            if (!supabase || !session.user?.email) return session;

            const { data: userData } = await supabase
                .from("users")
                .select("id")
                .eq("email", session.user.email)
                .single();

            if (userData) {
                (session.user as any).id = userData.id;

                const { data: creditsData } = await supabase
                    .from("user_credits")
                    .select("*")
                    .eq("user_id", userData.id)
                    .single();

                if (creditsData) {
                    (session.user as any).credits = creditsData;
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
