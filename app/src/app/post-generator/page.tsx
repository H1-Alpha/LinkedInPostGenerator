"use client";

import PostGenerator from "@/app/components/PostGenerator";
import supabase from "@/app/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PostGeneratorPage = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			const { data, error } = await supabase.auth.getUser();
			if (error) console.error(error);
			else setUser(data.user);
			setLoading(false);
		};
		fetchUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [loading, user, router]);

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error("Error logging out:", error);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Loading...</p>
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="h-screen bg-background text-foreground font-sans">
			<PostGenerator user={user} onLogout={handleLogout} />
		</div>
	);
};

export default PostGeneratorPage;
