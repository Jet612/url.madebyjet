export interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  alias?: string;
  createdAt: number;
  clicks: number;
  aiTags?: string[];
  aiSummary?: string;
}

export interface GeminiAliasResponse {
  suggestedAlias: string;
  category: string;
  summary: string;
  tags: string[];
}

export type SortOption = 'date' | 'clicks';
