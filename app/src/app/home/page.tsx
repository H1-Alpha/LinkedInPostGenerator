"use client";

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import PostGenerator from "../components/PostGenerator";
import supabase from "../lib/supabaseClient";

interface HomePageProps {
	onLogout?: () => void;
}

const HomePage = ({ onLogout }: HomePageProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

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

	const handleLoginWithPassword = async () => {
		setLoading(true);
		setMessage("");
		setErrorMsg("");

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setErrorMsg(error.message);
		} else {
			setUser(data.user);
		}

		setLoading(false);
	};

	const handleSignUp = async () => {
		setLoading(true);
		setMessage("");
		setErrorMsg("");

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			setErrorMsg(error.message);
		} else {
			setMessage("Check your email to confirm your account.");
		}

		setLoading(false);
	};

	const handleLoginWithMagicLink = async () => {
		setLoading(true);
		setMessage("");
		setErrorMsg("");

		const { data, error } = await supabase.auth.signInWithOtp({ email });

		if (error) {
			setErrorMsg(error.message);
		} else {
			setMessage("Magic link sent! Check your inbox.");
		}

		setLoading(false);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-foreground text-lg">Loading...</div>
			</div>
		);
	}

	if (user) return <PostGenerator user={user} onLogout={onLogout} />;

	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						LinkedIn Post Generator
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Create engaging LinkedIn posts with AI assistance
					</p>
				</div>

				<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-semibold text-foreground mb-6 text-center">
						Login or Sign Up
					</h2>

					<div className="space-y-4">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								className="w-full px-3 py-2 bg-background border border-gray-300 dark:border-gray-600 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								className="w-full px-3 py-2 bg-background border border-gray-300 dark:border-gray-600 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>

						{errorMsg && (
							<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
								{errorMsg}
							</div>
						)}

						{message && (
							<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md text-sm">
								{message}
							</div>
						)}

						<div className="space-y-3">
							<button
								onClick={handleLoginWithPassword}
								disabled={loading}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								Log in with Email + Password
							</button>

							<button
								onClick={handleSignUp}
								disabled={loading}
								className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								Sign Up
							</button>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300 dark:border-gray-600" />
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
										Or
									</span>
								</div>
							</div>

							<button
								onClick={handleLoginWithMagicLink}
								disabled={loading}
								className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								Send Magic Link
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
