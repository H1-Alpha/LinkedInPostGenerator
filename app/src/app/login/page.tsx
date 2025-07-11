"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const router = useRouter();

	const handleLoginWithPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrorMsg("");

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setErrorMsg(error.message);
		} else {
			// Redirect to home page after successful login
			router.push("/post-generator");
		}

		setLoading(false);
	};

	const handleLoginWithMagicLink = async () => {
		setLoading(true);
		setErrorMsg("");

		const { data, error } = await supabase.auth.signInWithOtp({ email });

		if (error) {
			setErrorMsg(error.message);
		} else {
			setErrorMsg("Magic link sent! Check your inbox.");
		}

		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Welcome Back
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Sign in to continue generating LinkedIn posts
					</p>
				</div>

				<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
					<form onSubmit={handleLoginWithPassword} className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-foreground mb-2"
							>
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
								disabled={loading}
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-foreground mb-2"
							>
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
								disabled={loading}
							/>
						</div>

						{errorMsg && (
							<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
								{errorMsg}
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							{loading ? "Signing In..." : "Sign In"}
						</button>
					</form>

					<div className="mt-6 space-y-3">
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

						<div className="text-center">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Don't have an account?{" "}
								<Link
									href="/signup"
									className="text-blue-600 hover:text-blue-500 font-medium"
								>
									Sign up here
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
