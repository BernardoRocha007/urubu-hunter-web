export interface EvaluationResult {
  id: string;
  itemId: string;
  score: number; // 0 - 100
  matchReasons: string[];
  concerns: string[];
  detectedTags: string[];
  verdict: string;
  isRecommended: boolean;
  evaluatedAt: string;
}

export interface CuratedItem {
  id: string;
  domain: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPct?: number;
  url: string;
  images: string[];
  category: string;
  availableSizes: string[];
  tags: string[];
  source: string;
  createdAt: string;
  evaluation?: EvaluationResult;
  feedback?: 'liked' | 'disliked' | 'saved' | null;
}

export interface FeedResponse {
  items: CuratedItem[];
  totalItems: number;
  page: number;
  totalPages: number;
  availableCategories: string[];
  generatedAt: string;
}

export interface FilterParams {
  domain?: string;
  minScore?: number;
  saleOnly?: boolean;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}
