import { CohereClientV2 } from 'cohere-ai';
import { NextRequest, NextResponse } from 'next/server';

const cohereApiKey = process.env.COHERE_API_KEY;

if (!cohereApiKey) {
  throw new Error('COHERE_API_KEY environment variable is not set');
}

const cohere = new CohereClientV2({
  token: cohereApiKey,
});

console.log( 'cohereApiKey', cohereApiKey );
console.log( 'cohere', cohere );  

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    const response = await cohere.chat({
      model: 'command-a-03-2025',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.message?.content;
    if (Array.isArray(content) && content.length > 0) {
      return NextResponse.json({ 
        generatedText: content[0].text || 'Failed to generate content' 
      });
    }

    return NextResponse.json({ 
      generatedText: 'Failed to generate content' 
    });

  } catch (error) {
    console.error('Error generating post:', error);
    return NextResponse.json(
      { error: 'Failed to generate LinkedIn post' },
      { status: 500 }
    );
  }
} 