import React from "react";

const LandingPage = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
			<div className="max-w-4xl mx-auto text-center">
				<h1 className="text-5xl font-bold text-gray-800 mb-6">
					Elevate Your LinkedIn Presence
				</h1>
				<p className="text-xl text-gray-600 mb-10">
					Generate professional, engaging LinkedIn posts in seconds with
					AI-powered suggestions
				</p>

				<div className="flex gap-6 justify-center">
					<button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-lg hover:shadow-xl">
						<a href="/signup">Get Started Free</a>
					</button>
					<button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-all">
						<a href="/login">Login</a>
					</button>
				</div>
			</div>

			{/* <div className="mt-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="bg-white p-6 rounded-xl shadow-md">
						<h3 className="text-gray-400 text-xl font-semibold mb-3">
							AI-Powered Suggestions
						</h3>
						<p className="text-gray-600">
							Get smart, personalized post ideas based on your industry and
							goals.
						</p>
					</div>
					<div className="bg-white p-6 rounded-xl shadow-md">
						<h3 className="text-gray-400 text-xl font-semibold mb-3">
							Time-Saving Templates
						</h3>
						<p className="text-gray-600">
							Quickly create posts from professionally designed templates.
						</p>
					</div>
					<div className="bg-white p-6 rounded-xl shadow-md">
						<h3 className="text-gray-400 text-xl font-semibold mb-3">
							Engagement Analytics
						</h3>
						<p className="text-gray-600">
							Track which posts perform best and refine your strategy.
						</p>
					</div>
				</div> */}
		</div>
	);
};

export default LandingPage;
