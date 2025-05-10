// src/llm/prompt.ts
export function buildFeedbackPrompt(userProfile: any, testResults: any): string {
  return `
You are a helpful typing coach.
The user is at a ${userProfile.level} level and aims to improve ${userProfile.goal} using the ${userProfile.layout} keyboard layout.
Their latest typing test results:
- WPM: ${testResults.wpm}
- Accuracy: ${testResults.accuracy}%
- Errors: ${testResults.errors}

Provide detailed, personalized feedback based on this performance. Suggest practical next steps.
`;
}

    