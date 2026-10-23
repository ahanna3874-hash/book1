export type CardType = 'fact' | 'emotion' | 'connection';

export interface QuestionCard {
  type: CardType;
  categoryTitle: string;
  badgeText: string;
  question: string;
  hint: string;
  thinkPrompt: string;
}

export interface CardGenerationResponse {
  isValid: boolean;
  guidanceMessage?: string;
  bookTitle?: string;
  sceneSummary?: string;
  cards?: QuestionCard[];
}

export interface BookPreset {
  id: string;
  title: string;
  author: string;
  genre: string;
  scene: string;
  recommendReason: string;
}
