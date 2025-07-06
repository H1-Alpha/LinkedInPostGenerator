interface GeneratePostParams {
  tone: string;
  targetReaction: string;
  topic: string;
  targetAudience: string;
  content?: string;
}

export const generateLinkedInPost = async (params: GeneratePostParams): Promise<string> => {
  const { tone, targetReaction, topic, targetAudience, content } = params;
  
  // Construct the prompt based on the parameters
  let prompt = `Generate a LinkedIn post with the following specifications:
- Tone: ${tone}
- Target Reaction: ${targetReaction}
- Topic: ${topic}
- Target Audience: ${targetAudience}`;

  // If there's existing content, include it as context
  if (content && content.trim()) {
    prompt += `\n\nExisting content/key points to consider:\n${content}`;
  }

  prompt += `\n\nPlease generate a professional LinkedIn post that follows these guidelines and is tailored for the specified target audience.`;

  try {
    // Replace this with your actual Cohere API call
    // For now, we'll simulate the API call
    const response = await fetch('/api/generate-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        tone,
        targetReaction,
        topic,
        targetAudience,
        content
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate post');
    }

    const data = await response.json();
    return data.generatedText;
  } catch (error) {
    console.error('Error generating post:', error);
    throw new Error('Failed to generate LinkedIn post');
  }
}; 