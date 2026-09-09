import { GoogleGenAI } from '@google/genai';
import { VideoKeyMoment } from './types';
import { VideoLecture } from '../types';

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({ apiKey });
}

function parseSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2) {
    const min = parts[0] ?? 0;
    const sec = parts[1] ?? 0;
    return min * 60 + sec;
  }
  if (parts.length === 3) {
    const hr = parts[0] ?? 0;
    const min = parts[1] ?? 0;
    const sec = parts[2] ?? 0;
    return hr * 3600 + min * 60 + sec;
  }
  return 0;
}

export async function analyzeVideoMoments(
  videoUrl: string,
  userPurpose?: string
): Promise<VideoKeyMoment[]> {
  const ai = getGenAIClient();
  const prompt = `You are an expert video analyst and research assistant.
Analyze this video to extract key timestamped events, architectural explanations, whiteboard notes, and factual claims that merit web research or verification.
${userPurpose ? `Viewer Purpose/Context: "${userPurpose}". Prioritize moments relevant to this purpose.` : ''}

Output ONLY valid JSON array with no markdown backticks, following this structure:
[
  {
    "start": "MM:SS",
    "title": "Short title (under 8 words)",
    "summary": "1-2 sentence informative summary",
    "category": "architecture" | "foundations" | "fact-check" | "whiteboard" | "analysis",
    "categoryLabel": "Architecture" | "Foundations" | "Fact-Check" | "Whiteboard Note" | "Analysis",
    "researchQuery": "Specific search query to verify or enrich this claim with research papers or external sources"
  }
]
Extract 4 to 8 distinct, meaningful moments.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              fileUri: videoUrl,
              mimeType: 'video/mp4',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const rawText = response.text?.trim() ?? '[]';
  const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

  try {
    const parsed = JSON.parse(cleanJson) as Array<{
      start: string;
      title: string;
      summary: string;
      category?: string;
      categoryLabel?: string;
      researchQuery?: string;
    }>;

    return parsed.map((item) => {
      const timeSec = parseSeconds(item.start);
      const validCategory = (item.category as VideoKeyMoment['category']) || 'analysis';
      return {
        startSec: timeSec,
        timeFormatted: item.start,
        title: item.title,
        summary: item.summary,
        category: validCategory,
        categoryLabel: item.categoryLabel || 'Analysis',
        researchQuery: item.researchQuery || item.title,
      };
    });
  } catch (err) {
    console.error('Failed to parse Gemini video analysis JSON:', rawText, err);
    return [];
  }
}

export async function generateChatResponse(
  message: string,
  context?: { videoUrl?: string | undefined; userPurpose?: string | undefined }
): Promise<{ text: string; actionPills?: string[] | undefined; recommendations?: VideoLecture[] | undefined }> {
  const ai = getGenAIClient();
  const prompt = `You are Co-Watcher, an intelligent, knowledgeable viewing companion and research assistant.
Viewer message: "${message}"
${context?.videoUrl ? `Current Video: ${context.videoUrl}` : 'No video currently playing.'}
${context?.userPurpose ? `Viewer Purpose: "${context.userPurpose}"` : ''}

Respond concisely and supportively. If the user asks for lecture or video recommendations, provide 2-4 curated recommendations.
Format response as JSON:
{
  "text": "Your helpful response text",
  "actionPills": ["Suggested Follow-up 1", "Suggested Follow-up 2"]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
  });

  const rawText = response.text?.trim() ?? '{}';
  const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

  try {
    const parsed = JSON.parse(cleanJson) as {
      text: string;
      actionPills?: string[];
    };
    return {
      text: parsed.text || rawText,
      actionPills: parsed.actionPills ?? undefined,
    };
  } catch {
    return {
      text: rawText,
      actionPills: ['Tell me more', 'Fact-check this section'],
    };
  }
}
