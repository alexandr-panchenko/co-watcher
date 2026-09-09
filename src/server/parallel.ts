import { ParallelSearchResult } from './types';

export interface ParallelSearchOptions {
  objective: string;
  searchQueries?: string[];
  maxResults?: number;
}

export async function searchParallelEvidence(
  options: ParallelSearchOptions
): Promise<ParallelSearchResult> {
  const apiKey = process.env.PARALLEL_API_KEY;
  if (!apiKey) {
    throw new Error('PARALLEL_API_KEY is not configured');
  }

  const endpoint = 'https://api.parallel.ai/v1beta/search';
  const bodyPayload: Record<string, unknown> = {
    objective: options.objective,
  };

  if (options.searchQueries && options.searchQueries.length > 0) {
    bodyPayload.search_queries = options.searchQueries.slice(0, 3);
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(bodyPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Parallel Search API error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as ParallelSearchResult;
  return data;
}
