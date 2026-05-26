import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/* ── Resume Analysis ── */
export async function analyzeResume(resumeText: string) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert resume analyst. Analyze the resume and extract information in valid JSON format only. No markdown, no code fences, just pure JSON.
Return this exact structure:
{
  "name": "candidate name",
  "skills": ["skill1", "skill2"],
  "experience": "brief summary of experience",
  "education": "education summary",
  "projects": ["project1", "project2"],
  "strengths": ["strength1", "strength2"],
  "suggestedRole": "most likely role they're applying for",
  "experienceLevel": "fresher|junior|mid|senior"
}`,
      },
      {
        role: 'user',
        content: `Analyze this resume:\n\n${resumeText}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1024,
  });

  const text = response.choices[0]?.message?.content || '{}';
  try {
    return JSON.parse(text);
  } catch {
    // Try extracting JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { name: 'Candidate', skills: [], experience: '', education: '', projects: [], strengths: [], suggestedRole: 'Software Developer', experienceLevel: 'fresher' };
  }
}

/* ── Generate Interview Questions ── */
export async function generateQuestions(
  resumeData: Record<string, unknown>,
  mode: 'technical' | 'hr' | 'mixed',
  count: number = 5,
) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert interviewer. Generate ${count} interview questions based on the candidate's resume. Mode: ${mode}.
${mode === 'technical' ? 'Focus on technical skills, coding concepts, system design, and problem-solving.' : ''}
${mode === 'hr' ? 'Focus on behavioral questions, teamwork, leadership, communication, and career goals.' : ''}
${mode === 'mixed' ? 'Mix both technical and behavioral questions.' : ''}

Return valid JSON only, no markdown:
{
  "questions": [
    {
      "id": 1,
      "question": "the question text",
      "type": "technical|behavioral|situational",
      "difficulty": "easy|medium|hard",
      "topic": "relevant topic",
      "expectedPoints": ["key point 1", "key point 2"]
    }
  ]
}`,
      },
      {
        role: 'user',
        content: `Candidate profile: ${JSON.stringify(resumeData)}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  const text = response.choices[0]?.message?.content || '{}';
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { questions: [] };
  }
}

/* ── Evaluate Answer ── */
export async function evaluateAnswer(
  question: string,
  answer: string,
  expectedPoints: string[],
) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert interview evaluator. Evaluate the candidate's answer and return valid JSON only:
{
  "score": 0-10,
  "feedback": "detailed feedback",
  "strengths": ["what they did well"],
  "improvements": ["what to improve"],
  "confidenceIndicators": {
    "clarity": 0-10,
    "depth": 0-10,
    "relevance": 0-10,
    "communication": 0-10
  },
  "sampleAnswer": "a brief ideal answer outline"
}`,
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nCandidate's Answer: ${answer}\n\nExpected key points: ${expectedPoints.join(', ')}`,
      },
    ],
    temperature: 0.4,
    max_tokens: 1024,
  });

  const text = response.choices[0]?.message?.content || '{}';
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { score: 5, feedback: 'Could not evaluate properly.', strengths: [], improvements: [], confidenceIndicators: { clarity: 5, depth: 5, relevance: 5, communication: 5 }, sampleAnswer: '' };
  }
}

/* ── Generate Improvement Roadmap ── */
export async function generateRoadmap(
  results: Record<string, unknown>[],
  resumeData: Record<string, unknown>,
) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a career coach. Based on the interview performance, generate a personalized improvement roadmap. Return valid JSON only:
{
  "overallScore": 0-100,
  "overallFeedback": "summary",
  "topStrengths": ["strength1", "strength2"],
  "areasToImprove": ["area1", "area2"],
  "roadmap": [
    {
      "week": 1,
      "focus": "topic",
      "tasks": ["task1", "task2"],
      "resources": ["resource1"]
    }
  ],
  "tips": ["tip1", "tip2"]
}`,
      },
      {
        role: 'user',
        content: `Interview results: ${JSON.stringify(results)}\nCandidate profile: ${JSON.stringify(resumeData)}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 2048,
  });

  const text = response.choices[0]?.message?.content || '{}';
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { overallScore: 50, overallFeedback: '', topStrengths: [], areasToImprove: [], roadmap: [], tips: [] };
  }
}
