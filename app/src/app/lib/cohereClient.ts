interface GeneratePostParams {
	tone: string;
	target_reaction: string;
	topic: string;
	target_audience: string;
	content?: string;
}

export const generateLinkedInPost = async (
	params: GeneratePostParams
): Promise<string> => {
	const { tone, target_reaction, topic, target_audience, content } = params;
	// Construct the prompt based on the parameters
	let prompt = `Generate a LinkedIn post with the following specifications:
- Tone: ${tone}
- Target Reaction: ${target_reaction}
- Topic: ${topic}
- Target Audience: ${target_audience}`;

	// If there's existing content, include it as context
	if (content && content.trim()) {
		prompt += `\n\nExisting content/key points to consider:\n${content}`;
	}

	prompt += `\n\nPlease generate a professional LinkedIn post that follows these guidelines and is tailored for the specified target audience.
   Avoid mentioning the tone, target reaction, target audience. Make sure to generate a post that is relevant to the topic and target audience. Display in text format, avoid using bold, italic, or any other formatting.
   Include hashtags, emojis in the post.`;

	try {
		// Use the API route to call Cohere
		const response = await fetch("/api/generate-post", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ prompt }),
		});

		if (!response.ok) {
			throw new Error("Failed to generate post");
		}

		const data = await response.json();
		return data.generatedText;
	} catch (error) {
		console.error("Error generating post:", error);
		throw new Error("Failed to generate LinkedIn post");
	}
};
