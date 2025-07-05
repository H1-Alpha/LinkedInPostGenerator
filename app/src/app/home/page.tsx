"use client"; // <- Add this at the very top

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import PostGenerator from "../components/PostGenerator";
import supabase from "../lib/supabaseClient";

const HomePage = () => {
	const [user, setUser] = useState<User | null>(null);
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [loginRequested, setLoginRequested] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			const { data, error } = await supabase.auth.getUser();
			if (error) {
				console.error(error);
			} else {
				setUser(data.user);
			}
		};
		fetchUser();
	}, []);

	const handleLogin = async (email: string) => {
		setLoading(true);
		const { data, error } = await supabase.auth.signInWithOtp({ email });
		if (error) {
			console.error(error);
		} else {
			setLoginRequested(true);
		}
		setLoading(false);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (user) {
		return <PostGenerator user={user} />;
	}

	if (loginRequested) {
		return (
			<div>
				<p>Please check your email for a magic link to login.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Enter your email"
				className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
			/>
			<button
				onClick={() => handleLogin(email)}
				className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
			>
				Login
			</button>
		</div>
	);
};

export default HomePage;
