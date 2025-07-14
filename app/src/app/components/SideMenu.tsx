import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface GeneratedPost {
	id: string;
	tone: string;
	topic: string;
	created_at: Date;
	content: string;
	target_audience: string;
	target_reaction: string;
}

interface SideMenuProps {
	user: User;
	onLogout: () => void;
	generatedPosts: GeneratedPost[];
	onSelectPost: (post: GeneratedPost) => void;
	onDeletePost: (postId: string) => void;
	selectedPostId?: string;
	isCollapsed?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({
	user,
	generatedPosts,
	onLogout,
	onSelectPost,
	onDeletePost,
	selectedPostId,
}) => {
	const [posts, setPosts] = useState<GeneratedPost[]>(generatedPosts);

	const fetchPosts = async () => {
		if (!user) return;
		try {
			const res = await fetch(
				`/api/posts?user_id=${encodeURIComponent(user.id)}`
			);
			const result = await res.json();
			const formattedPosts = result.posts.map((post: any) => ({
				...post,
				created_at: new Date(post.created_at),
			}));
			setPosts(formattedPosts);
		} catch (err) {
			console.error("Failed to fetch posts", err);
		}
	};

	// Call when post is generated
	const handleNewPostGenerated = async () => {
		await fetchPosts();
	};

	useEffect(() => {
		if (user) fetchPosts();
	}, [user]);

	return (
		<div className="w-80 h-screen bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
			{/* Header - LinkedIn Post Generator */}
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<h1 className="text-lg font-semibold text-gray-900 dark:text-white">
					LinkedIn Post Generator
				</h1>
			</div>

			{/* Scrollable Posts List */}
			<div className="flex-1 overflow-y-auto">
				<div className="p-4">
					<h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
						Generated Posts
					</h2>

					{posts.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								No posts generated yet
							</p>
							<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
								Generate your first post to see it here
							</p>
						</div>
					) : (
						<div className="space-y-2">
							{posts.map((post) => (
								<div
									key={post.id}
									className={`group relative p-3 rounded-lg transition-colors ${
										selectedPostId === post.id
											? "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
											: "hover:bg-gray-100 dark:hover:bg-gray-800"
									}`}
								>
									<button
										onClick={() => onSelectPost(post)}
										className="w-full text-left"
									>
										<div className="text-sm font-medium text-gray-900 dark:text-white truncate pr-8">
											{post.topic}
										</div>
										<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
											{post.created_at.toLocaleDateString()}{" "}
											{post.created_at.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
									</button>

									{/* Delete button */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											onDeletePost(post.id);
										}}
										className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded"
										title="Delete post"
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Footer - User Info and Logout */}
			<div className="p-4 border-t border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
							{user.email}
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{user.email?.split("@")[1]}
						</p>
					</div>
					<button
						onClick={onLogout}
						className="ml-3 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
};

export default SideMenu;
