// ─── Child Profile ────────────────────────────────────────────────────────────

export type StoryTheme =
  | 'dinosaurs'
  | 'space'
  | 'fantasy'
  | 'ocean'
  | 'superheroes'
  | 'jungle'
  | 'magic-school';

export type DeliveryFormat = 'digital' | 'print' | 'both';

export interface ChildProfile {
  name: string;
  age: number;                   // 3–10
  photos: File[];                // 2–3 photos
  photoUrls: string[];           // object URLs for preview
  theme: StoryTheme;
  interests: string[];           // free-form tags
  bestFriend: string;            // used as sidekick character
  fears: string;                 // woven in as conquered challenge
  favoritePlace: string;         // setting detail
}

// ─── Story ───────────────────────────────────────────────────────────────────

export interface StoryPage {
  id: number;
  text: string;                  // narrative paragraph
  illustrationPrompt: string;    // SD prompt
  illustrationUrl?: string;      // resolved image URL
  emoji: string;                 // decorative scene emoji
}

export interface Story {
  id: string;
  childName: string;
  theme: StoryTheme;
  title: string;
  pages: StoryPage[];
  createdAt: Date;
  status: 'generating' | 'ready' | 'ordered';
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface OrderDetails {
  format: DeliveryFormat;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  email: string;
  subscribeMonthly: boolean;
}

// ─── App State ───────────────────────────────────────────────────────────────

export type AppStep =
  | 'landing'
  | 'onboarding'
  | 'generating'
  | 'preview'
  | 'order'
  | 'confirmation';
