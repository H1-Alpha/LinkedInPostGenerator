import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	console.error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const { data, error } = await supabase
			.from("users")
			.select("email")
			.eq("email", email);

		if (error) {
			console.error("Supabase query error:", error);
			return NextResponse.json({ exists: false }, { status: 500 });
		}

		return NextResponse.json({ exists: data.length > 0 });
	} catch (err) {
		console.error("API error:", err);
		return NextResponse.json({ exists: false }, { status: 500 });
	}
}
