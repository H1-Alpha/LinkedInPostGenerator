import type { User } from "@supabase/supabase-js";
import { set } from "cohere-ai/core/schemas";
import { useEffect, useState } from "react";
import { generateLinkedInPost } from "../lib/cohereClient";
import SideMenu from "./SideMenu";

interface GeneratedPost {
	id: string;
	tone: string;
	topic: string;
	created_at: Date;
	content: string;
	target_audience: string;
	target_reaction: string;
}

interface PostGeneratorProps {
	user: User;
	onLogout?: () => void;
}

const PostGenerator: React.FC<PostGeneratorProps> = ({ user, onLogout }) => {
	const [tone, setTone] = useState("professional");
	const [target_reaction, setTarget_reaction] = useState("like");
	const [topic, setTopic] = useState("");
	const [target_audience, setTarget_audience] = useState("");
	const [content, setContent] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState("");
	const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
	const [selectedPostId, setSelectedPostId] = useState<string | undefined>();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsGenerating(true);
		setError("");

		try {
			const generatedText = await generateLinkedInPost({
				tone,
				target_reaction,
				topic,
				target_audience,
				content: content.trim() || undefined, // Only pass if there's content
			});

			console.log("generatedText", generatedText);

			if (selectedPostId === undefined) {
				// Create new post
				const newPost: GeneratedPost = {
					id: Date.now().toString(),
					tone,
					topic,
					created_at: new Date(),
					content: generatedText,
					target_audience: target_audience,
					target_reaction: target_reaction,
				};

				// console.log("newPost", newPost);
				// console.log("user", user);

				// Save to database
				try {
					const response = await fetch("/api/posts", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							tone,
							topic,
							content: generatedText,
							user_id: user.id,
							target_audience: target_audience,
							target_reaction: target_reaction,
						}),
					});

					if (response.ok) {
						const { post } = await response.json();
						// Update the post with the database ID
						const savedPost = { ...newPost, id: post.id };
						setGeneratedPosts((prev) => [savedPost, ...prev]);
						setSelectedPostId(savedPost.id);
					} else {
						// If save fails, still add to local state
						setGeneratedPosts((prev) => [newPost, ...prev]);
						setSelectedPostId(newPost.id);
					}
				} catch (error) {
					console.error("Error saving post:", error);
					// If save fails, still add to local state
					setGeneratedPosts((prev) => [newPost, ...prev]);
					setSelectedPostId(newPost.id);
				}

				// Replace the content with the generated text
				setContent(generatedText);
			} else {
				console.log("Updating existing post with ID:", selectedPostId);
				// Update existing post
				const updatedPost: GeneratedPost = {
					id: selectedPostId,
					tone,
					topic,
					created_at: new Date(),
					content: generatedText,
					target_audience: target_audience,
					target_reaction: target_reaction,
				};

				// Save to database
				try {
					const response = await fetch("/api/posts", {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(updatedPost),
					});

					if (response.ok) {
						const { post } = await response.json();
						setGeneratedPosts((prev) =>
							prev.map((p) => (p.id === post.id ? post : p))
						);
					} else {
						throw new Error("Failed to update post");
					}
				} catch (error) {
					console.error("Error updating post:", error);
				}

				setContent(generatedText);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to generate post");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleSelectPost = (post: GeneratedPost) => {
		setSelectedPostId(post.id);
		setContent(post.content || "");
		setTopic(post.topic);
		setTone(post.tone);
		setTarget_reaction(post.target_reaction);
		setTarget_audience(post.target_audience);
	};

	const handleDeletePost = async (postId: string) => {
		try {
			const response = await fetch(`/api/posts?id=${postId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete post");
			}

			// Remove from local state
			setGeneratedPosts((prev) => prev.filter((post) => post.id !== postId));

			// If the deleted post was selected, clear the selection
			if (selectedPostId === postId) {
				setSelectedPostId(undefined);
				setContent("");
				setTopic("");
			}
		} catch (error) {
			console.error("Error deleting post:", error);
			// You could add a toast notification here
		}
	};

	const handleUpdatePost = async (post: GeneratedPost) => {
		try {
			const response = await fetch("/api/posts", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: post.id,
					tone: post.tone,
					topic: post.topic,
					content: post.content,
					target_audience: post.target_audience,
					target_reaction: post.target_reaction,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update post");
			}

			const updatedPost = await response.json();
			setGeneratedPosts((prev) =>
				prev.map((p) => (p.id === updatedPost.post.id ? updatedPost.post : p))
			);
		} catch (error) {
			console.error("Error updating post:", error);
			// You could add a toast notification here
		}
	};

	return (
		<div className="h-screen flex overflow-hidden">
			{/* Side Menu */}
			<SideMenu
				user={user}
				onLogout={onLogout || (() => {})}
				generatedPosts={generatedPosts}
				onSelectPost={handleSelectPost}
				onDeletePost={handleDeletePost}
				selectedPostId={selectedPostId}
			/>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Form Controls */}
				<div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
					<div className="max-w-4xl mx-auto flex flex-col">
						<h1 className="text-xl font-bold mb-2 text-foreground">
							Welcome, {user.email}
						</h1>

						<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
							{/* Tone and Reaction */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div>
									<label
										htmlFor="tone"
										className="block text-xs font-medium text-foreground mb-1"
									>
										Tone
									</label>
									<select
										id="tone"
										value={tone}
										onChange={(e) => setTone(e.target.value)}
										className="w-full px-2 py-1 bg-background border border-gray-300 dark:border-gray-600 text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
									<label
										htmlFor="target_reaction"
										className="block text-xs font-medium text-foreground mb-1"
									>
										Target Reaction
									</label>
									<select
										id="target_reaction"
										value={target_reaction}
										onChange={(e) => setTarget_reaction(e.target.value)}
										className="w-full px-2 py-1 bg-background border border-gray-300 dark:border-gray-600 text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
							</div>

							{/* Topic */}
							<div>
								<label
									htmlFor="topic"
									className="block text-xs font-medium text-foreground mb-1"
								>
									Topic
								</label>
								<input
									type="text"
									id="topic"
									value={topic}
									onChange={(e) => setTopic(e.target.value)}
									placeholder="Enter your post topic"
									className="w-full px-2 py-1 bg-background border border-gray-300 dark:border-gray-600 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
									required
									disabled={isGenerating}
								/>
							</div>

							{/* Target Audience */}
							<div>
								<label
									htmlFor="target_audience"
									className="block text-xs font-medium text-foreground mb-1"
								>
									Target Audience
								</label>
								<input
									type="text"
									id="target_audience"
									value={target_audience}
									onChange={(e) => setTarget_audience(e.target.value)}
									placeholder="e.g., software engineers, tech enthusiasts"
									className="w-full px-2 py-1 bg-background border border-gray-300 dark:border-gray-600 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
									required
									disabled={isGenerating}
								/>
							</div>

							{error && (
								<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
									{error}
								</div>
							)}

							<button
								type="submit"
								disabled={isGenerating}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-400"
							>
								{isGenerating ? "Generating..." : "Generate Post"}
							</button>
						</form>
					</div>
				</div>

				{/* Content Output Area */}
				<div className="flex-1 overflow-y-auto p-6 bg-background">
					<div className="max-w-4xl mx-auto h-full flex flex-col">
						<label
							htmlFor="content"
							className="block text-sm font-medium text-foreground mb-2"
						>
							Content
						</label>
						<textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Leave empty to generate from scratch or add key points to guide the generation"
							className="flex-1 w-full px-3 py-2 bg-background border border-gray-300 dark:border-gray-600 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
							disabled={isGenerating}
							rows={10}
						/>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
							Leave empty to generate from scratch, or add key points to guide
							the generation
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostGenerator;
