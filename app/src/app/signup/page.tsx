"use client";

import Link from "next/link";
import React, { useState } from "react";
import supabase from "../lib/supabaseClient";

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [errorMsg, setErrorMsg] = useState<string | React.ReactElement>("");

	// Password validation function
	const validatePassword = (password: string) => {
		const minLength = password.length >= 8;
		const hasLowercase = /[a-z]/.test(password);
		const hasUppercase = /[A-Z]/.test(password);
		const hasDigit = /\d/.test(password);
		const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

		return {
			isValid: minLength && hasLowercase && hasUppercase && hasDigit && hasSymbol,
			minLength,
			hasLowercase,
			hasUppercase,
			hasDigit,
			hasSymbol
		};
	};

	const checkEmailExists = async (email: string) => {
	try {
		const response = await fetch(
			`https://omndnjyvasaekaaakryh.supabase.co/rest/v1/users?email=eq.${email}&select=email`,
			{
				method: 'GET',
				headers: {
					apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);

		if (!response.ok) {
			console.error('Error checking email:', response.statusText);
			return false;
		}

		const data = await response.json();
		return data.length > 0; // true if email exists
	} catch (error) {
		console.error('Error checking email existence:', error);
		return false;
	}
};


	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		setErrorMsg("");

		// Validate passwords match
		if (password !== confirmPassword) {
			setErrorMsg("Passwords do not match");
			setLoading(false);
			return;
		}

		// Validate password strength
		const passwordValidation = validatePassword(password);
		if (!passwordValidation.isValid) {
			setErrorMsg("Password does not meet the requirements. Please check the criteria below.");
			setLoading(false);
			return;
		}

		// Check if email already exists
		const emailExists = await checkEmailExists(email);
		if (emailExists) {
			setErrorMsg(
				<div className="space-y-2">
					<p>An account with this email already exists.</p>
					<p className="text-sm">
						Please{" "}
						<Link 
							href="/login" 
							className="text-blue-600 hover:text-blue-500 font-medium underline"
						>
							sign in here
						</Link>{" "}
						instead.
					</p>
				</div>
			);
			setLoading(false);
			return;
		}

		// Proceed with signup if email doesn't exist
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

	const passwordValidation = validatePassword(password);

	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Create Account
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Sign up to start generating LinkedIn posts
					</p>
				</div>

				<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
					<form onSubmit={handleSignUp} className="space-y-4">
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
								disabled={loading}
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
									className="w-full px-3 py-2 pr-10 bg-background border border-gray-300 dark:border-gray-600 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									required
									disabled={loading}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
									disabled={loading}
								>
									{showPassword ? (
										<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
										</svg>
									) : (
										<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>
							
							{/* Password requirements */}
							<div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
								<p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
									Password Requirements:
								</p>
								<div className="space-y-1">
									<div className={`flex items-center text-xs ${passwordValidation.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
										<span className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.minLength ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
										Minimum 8 characters
									</div>
									<div className={`flex items-center text-xs ${passwordValidation.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
										<span className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasLowercase ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
										At least one lowercase letter
									</div>
									<div className={`flex items-center text-xs ${passwordValidation.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
										<span className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasUppercase ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
										At least one uppercase letter
									</div>
									<div className={`flex items-center text-xs ${passwordValidation.hasDigit ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
										<span className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasDigit ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
										At least one digit
									</div>
									<div className={`flex items-center text-xs ${passwordValidation.hasSymbol ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
										<span className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasSymbol ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
										At least one symbol (!@#$%^&* etc.)
									</div>
								</div>
							</div>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
								Confirm Password
							</label>
							<div className="relative">
								<input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Confirm your password"
									className="w-full px-3 py-2 pr-10 bg-background border border-gray-300 dark:border-gray-600 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									required
									disabled={loading}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
									disabled={loading}
								>
									{showConfirmPassword ? (
										<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
										</svg>
									) : (
										<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>
							{confirmPassword && password !== confirmPassword && (
								<p className="text-xs text-red-600 dark:text-red-400 mt-1">
									Passwords do not match
								</p>
							)}
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

						<button
							type="submit"
							disabled={loading || !passwordValidation.isValid || password !== confirmPassword}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							{loading ? "Creating Account..." : "Sign Up"}
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Already have an account?{" "}
							<Link 
								href="/login" 
								className="text-blue-600 hover:text-blue-500 font-medium"
							>
								Sign in here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp; 