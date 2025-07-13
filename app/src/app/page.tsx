"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "./lib/supabaseClient";

export default function Home() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			const { data, error } = await supabase.auth.getUser();
			if (error) {
				console.error(error);
			} else {
				setUser(data.user);
			}
			setLoading(false);
		};
		fetchUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	// Redirect to welcome page if no user is logged in
	useEffect(() => {
		if (!loading && !user) {
			router.push("/welcome");
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-foreground text-lg">Loading...</div>
			</div>
		);
	}

	if (!user) return null;

	return router.push("/post-generator");
}
