export type DomainId = 'fashion' | 'pc-hardware' | string;

export interface Product {
  id: string;
  domain: DomainId;
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
}

export interface EvaluationResult {
  itemId: string;
  score: number;
  matchReasons: string[];
  concerns: string[];
  detectedTags: string[];
  verdict: string;
  isRecommended: boolean;
  evaluatedAt: string;
}

export interface CuratedItem extends Product {
  evaluation: EvaluationResult;
  feedback?: 'liked' | 'disliked' | 'saved' | null;
}

export interface StyleProfile {
  domain: DomainId;
  aestheticKeywords: string[];
  preferredSizes: string[];
  maxPrice: number;
  minDiscountPct?: number;
  forbiddenTerms: string[];
  targetStores: string[];
}

export interface DomainDefinition {
  id: DomainId;
  name: string;
  description: string;
  icon: string;
  defaultKeywords: string[];
  sizeOptions: string[];
  defaultStores: string[];
}

export interface HuntStatus {
  isRunning: boolean;
  domain: DomainId | null;
  lastRun: string | null;
  itemsFound: number;
  itemsCurated: number;
  error?: string;
}

export interface WatchlistItem {
  id: string;
  url: string;
  title: string;
  brand: string;
  initialPrice: number;
  lastPrice: number;
  lowestPrice: number;
  targetPrice?: number;
  currency: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  lastCheckedAt: string;
  priceHistory: Array<{
    price: number;
    timestamp: string;
  }>;
}

export interface UserNotificationConfig {
  email?: string;
  phone?: string;
  notifyOnPriceDrop: boolean;
  notifyOnTargetMet: boolean;
  channels: {
    email: boolean;
    whatsapp: boolean;
    telegram: boolean;
    discord: boolean;
  };
  telegramChatId?: string;
  discordWebhookUrl?: string;
}

export interface PaginatedItemsResponse {
  items: CuratedItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ClearFeedResponse {
  success: boolean;
  cleared: number;
  preserved: number;
  message: string;
}

