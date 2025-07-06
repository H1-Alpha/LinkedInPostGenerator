import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { generateLinkedInPost } from "../lib/cohereClient";

interface PostGeneratorProps {
	user: User;
}

const PostGenerator: React.FC<PostGeneratorProps> = ({ user }) => {
	const [tone, setTone] = useState("professional");
	const [targetReaction, setTargetReaction] = useState("like");
	const [topic, setTopic] = useState("");
	const [targetAudience, setTargetAudience] = useState("");
	const [content, setContent] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsGenerating(true);
		setError("");

		try {
			const generatedText = await generateLinkedInPost({
				tone,
				targetReaction,
				topic,
				targetAudience,
				content: content.trim() || undefined // Only pass if there's content
			});
			
			// Replace the content with the generated text
			setContent(generatedText);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to generate post");
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6 text-foreground">Welcome, {user.email}</h1>
			
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="tone" className="block text-sm font-medium text-foreground mb-2">
						Tone
					</label>
					<select
						id="tone"
						value={tone}
						onChange={(e) => setTone(e.target.value)}
						className="w-full px-3 py-2 bg-background border border-gray-300 dark:border-gray-600 text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						required
						disabled={isGenerating}
					>
						<option value="professional">Professional</option>
						<option value="casual">Casual</option>
						<option value="friendly">Friendly</option>
						<option value="enthusiastic">Enthusiastic</option>
						<option value="thoughtful">Thoughtful</option>
						<option value="humorous">Humorous</option>
					</select>
				</div>

				<div>
					<label htmlFor="targetReaction" className="block text-sm font-medium text-foreground mb-2">
						Target Reaction
					</label>
					<select
						id="targetReaction"
						value={targetReaction}
						onChange={(e) => setTargetReaction(e.target.value)}
						className="w-full px-3 py-2 bg-background border border-gray-300 dark:border-gray-600 text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						required
						disabled={isGenerating}
					>
						<option value="like">Like</option>
						<option value="celebrate">Celebrate</option>
						<option value="support">Support</option>
						<option value="love">Love</option>
						<option value="insightful">Insightful</option>
						<option value="funny">Funny</option>
					</select>
				</div>

				<div>
					<label htmlFor="topic" className="block text-sm font-medium text-foreground mb-2">
						Topic
					</label>
					<input
						type="text"
						id="topic"
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
						placeholder="Enter your post topic"
						className="w-full px-3 py-2 bg-background border border-gray-300 dark:border-gray-600 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						required
						disabled={isGenerating}
					/>
				</div>

				<div>
					<label htmlFor="targetAudience" className="block text-sm font-medium text-foreground mb-2">
						Target Audience
					</label>
					<input
						type="text"
						id="targetAudience"
						value={targetAudience}
						onChange={(e) => setTargetAudience(e.target.value)}
						placeholder="e.g., software engineers, tech enthusiasts, startup founders, marketing professionals"
						className="w-full px-3 py-2 bg-background border border-gray-300 dark:border-gray-600 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						required
						disabled={isGenerating}
					/>
				</div>

				<div>
					<label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
						Content
					</label>
					<textarea
						id="content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Enter your post content or key points (optional - will be used as context for generation)"
						rows={6}
						className="w-full px-3 py-2 bg-background border border-gray-300 dark:border-gray-600 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isGenerating}
					/>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Leave empty to generate from scratch, or add key points to guide the generation
					</p>
				</div>

				{error && (
					<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
						{error}
					</div>
				)}

				<button
					type="submit"
					disabled={isGenerating}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{isGenerating ? "Generating..." : "Generate Post"}
				</button>
			</form>
		</div>
	);
};

export default PostGenerator;
