import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	console.error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// GET endpoint - Get all posts for a user
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("user_id");

		if (!userId) {
			return NextResponse.json(
				{ error: "user_id parameter is required" },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching posts:", error);
			return NextResponse.json(
				{ error: "Failed to fetch posts" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ posts: data });
	} catch (error) {
		console.error("Error in GET /api/posts:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// POST endpoint - Create a new post
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { tone, topic, content, user_id, target_audience, target_reaction } =
			body;

		console.log("Creating post with body:", body);

		if (!topic || !user_id) {
			return NextResponse.json(
				{ error: "topic and user_id are required" },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from("posts")
			.insert([
				{
					tone: tone || null,
					topic,
					content: content || null,
					user_id,
					target_audience: target_audience || null,
					target_reaction: target_reaction || null,
				},
			])
			.select()
			.single();

		if (error) {
			console.error("Supabase insert error:", error);
			return NextResponse.json(
				{ error: error.message || "Failed to create post" },
				{ status: 500 }
			);
		}

		console.log("Post created:", data);

		return NextResponse.json({ post: data }, { status: 201 });
	} catch (error) {
		console.error("Unexpected error in POST /api/posts:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

//PUT endpoint - Update a post
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		const { id, tone, topic, content, target_audience, target_reaction } = body;

		if (!id) {
			return NextResponse.json({ error: "id is required" }, { status: 400 });
		}
		console.log("Updating post with body:", body);
		const { data, error } = await supabase
			.from("posts")
			.update({ tone, topic, content, target_audience, target_reaction })
			.eq("id", id)
			.select()
			.single();

		if (error) {
			console.error("Error updating post:", error);
			return NextResponse.json(
				{ error: "Failed to update post" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ post: data }, { status: 200 });
	} catch (error) {
		console.error("Error in PUT /api/posts:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

//DELETE endpoint - Delete a post
export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "id parameter is required" },
				{ status: 400 }
			);
		}

		const { error } = await supabase.from("posts").delete().eq("id", id);

		if (error) {
			console.error("Error deleting post:", error);
			return NextResponse.json(
				{ error: "Failed to delete post" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error in DELETE /api/posts:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
