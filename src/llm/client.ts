// src/llm/client.ts
import fetch from 'node-fetch';

export async function getLLMFeedback(prompt: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'minicpm-v',
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`LLM request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response || '[No feedback received]';
}
