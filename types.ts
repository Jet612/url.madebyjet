export interface ShortenedLink {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  alias?: string | null;
  clicks: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type SortOption = 'date' | 'clicks';
