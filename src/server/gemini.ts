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
Video URL / Title: ${videoUrl}
${userPurpose ? `Viewer Purpose/Context: "${userPurpose}". Prioritize moments relevant to this purpose.` : ''}

Output ONLY a valid JSON array with no markdown backticks, following this structure:
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const rawText = response.text?.trim() ?? '[]';
    const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

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
    console.error('Failed to analyze video moments with Gemini:', err);
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

Respond concisely and supportively.
Format response as JSON:
{
  "text": "Your helpful response text",
  "actionPills": ["Suggested Follow-up 1", "Suggested Follow-up 2"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const rawText = response.text?.trim() ?? '{}';
    const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

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
      text: "I'm ready to watch and analyze this lecture with you. Ask questions, fact-check claims, or record reactions anytime.",
      actionPills: ['Tell me more', 'Fact-check this section'],
    };
  }
}

export async function generateRecommendations(
  query: string,
  userPurpose?: string
): Promise<VideoLecture[]> {
  const ai = getGenAIClient();
  const prompt = `You are Co-Watcher's lecture discovery engine.
User search or viewing goal: "${query}"
${userPurpose ? `User context: "${userPurpose}"` : ''}

Provide 3 to 4 real, high-quality, authentic academic lectures or technical talks on YouTube that directly fulfill this request.
Include real YouTube video IDs (e.g. "TjZBTDzGeGg", "bCz4OMemCcA", "O5xeyoRL95U", "z-EtmaFJieY", "IHZwWFHWa-w", etc.).

Return ONLY a valid JSON array of objects with this exact structure, no markdown backticks:
[
  {
    "id": "slug-id",
    "title": "Full Lecture or Video Title",
    "institution": "University or Organization (e.g. MIT, Stanford HAI, Oxford)",
    "speaker": "Speaker name if applicable",
    "duration": "MM:SS or H:MM:SS",
    "durationSec": 3200,
    "badgeType": "best-match" | "technical" | "clashes" | "quick",
    "badgeLabel": "Best match" | "Most Technical" | "Foundational" | "Quick Overview",
    "badgeCategory": "Category label",
    "description": "2 sentence explanation of why this lecture is worth watching for this specific user goal",
    "videoId": "11-character-youtube-id",
    "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
    "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg"
  }
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const rawText = response.text?.trim() ?? '[]';
    const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    const parsed = JSON.parse(cleanJson) as Array<VideoLecture>;
    return parsed.map((item, idx) => {
      const vidId = item.videoId || 'bCz4OMemCcA';
      return {
        id: item.id || `lecture-${idx + 1}`,
        title: item.title,
        institution: item.institution || 'Academic Lecture',
        speaker: item.speaker,
        duration: item.duration || '45:00',
        durationSec: item.durationSec || 2700,
        badgeType: item.badgeType || (idx === 0 ? 'best-match' : 'technical'),
        badgeLabel: item.badgeLabel || 'Recommended',
        badgeCategory: item.badgeCategory || 'Lecture',
        description: item.description,
        videoId: vidId,
        youtubeUrl: item.youtubeUrl || `https://www.youtube.com/watch?v=${vidId}`,
        thumbnail: item.thumbnail || `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`,
      };
    });
  } catch (err) {
    console.error('Failed to generate dynamic recommendations with Gemini:', err);
    return [];
  }
}
