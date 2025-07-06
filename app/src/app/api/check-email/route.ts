import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('Checking email existence for:', email);
    console.log('Supabase URL:', supabaseUrl);
    console.log('Using table: users');

    // Query the public.users table to check if email exists
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    console.log('Query result - data:', data);
    console.log('Query result - error:', error);

    if (error) {
      // If no rows found, error.code will be 'PGRST116'
      if (error.code === 'PGRST116') {
        console.log('Email not found in users table:', email);
        return NextResponse.json({ exists: false });
      }
      
      console.error('Database error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
    }

    // If we get here, the email was found
    console.log('Email found in users table:', email);
    return NextResponse.json({ exists: true });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 