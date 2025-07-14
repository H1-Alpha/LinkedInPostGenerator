"use client";

import PostGenerator from "@/app/components/PostGenerator";
import supabase from "@/app/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";

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

const PostGeneratorPage = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
	const [selectedPostId, setSelectedPostId] = useState<string | undefined>();
	const [tone, setTone] = useState("professional");
	const [target_reaction, setTarget_reaction] = useState("like");
	const [topic, setTopic] = useState("");
	const [target_audience, setTarget_audience] = useState("");
	const [content, setContent] = useState("");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

	const handleSelectPost = async (post: GeneratedPost) => {
		setSelectedPostId(post.id);
		setTone(post.tone);
		setTarget_reaction(post.target_reaction);
		setTopic(post.topic);
		setTarget_audience(post.target_audience);
		setContent(post.content);
	};

	const handleDeletePost = async (postId: string) => {
		try {
			const response = await fetch(
				`/api/posts?id=${postId}&user_id=${encodeURIComponent(user.id)}`,
				{
					method: "DELETE",
				}
			);

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

	const selectedPost = selectedPostId
		? {
				id: selectedPostId,
				tone,
				topic,
				created_at: new Date(),
				content,
				target_audience,
				target_reaction,
		  }
		: undefined;

	return (
		<div
			className={`h-screen bg-background text-foreground font-sans flex transition-all duration-300`}
		>
			{/* Sidebar */}
			<div
				className={`${
					isSidebarOpen ? "w-80" : "w-0"
				} bg-muted border-border transition-all duration-300`}
			>
				<SideMenu
					user={user}
					onLogout={handleLogout || (() => {})}
					generatedPosts={generatedPosts}
					onSelectPost={handleSelectPost}
					onDeletePost={handleDeletePost}
					selectedPostId={selectedPostId}
					isCollapsed={!isSidebarOpen} // pass this to SideMenu
				/>
			</div>

			{/* Main content */}
			<div className="flex-1 overflow-auto relative">
				{/* Toggle Button */}
				<button
					className="absolute top-4 left-4 z-50 bg-muted p-2 rounded-full shadow-md"
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
				>
					{isSidebarOpen ? "⮜" : "☰"}
				</button>

				<PostGenerator user={user} post={selectedPost} />
			</div>
		</div>
	);
};

export default PostGeneratorPage;
