"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HomePage from "./home/page";
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

		// Listen for auth state changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		// Redirect to signup if user is not authenticated and not loading
		if (!loading && !user) {
			router.push('/signup');
		}
	}, [user, loading, router]);

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error);
		}
	};

	// Show loading while checking authentication
	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-foreground text-lg">Loading...</div>
			</div>
		);
	}

	// Don't render anything if user is not authenticated (will redirect)
	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header with logout */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
				<div className="max-w-4xl mx-auto flex justify-between items-center">
					<div>
						<h1 className="text-xl font-semibold text-foreground">LinkedIn Post Generator</h1>
						<p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user.email}</p>
					</div>
					<button
						onClick={handleLogout}
						className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
					>
						Logout
					</button>
				</div>
			</div>

			{/* Main content */}
			<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
				<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
					<HomePage />
				</main>
				<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
			</div>
		</div>
	);
}
