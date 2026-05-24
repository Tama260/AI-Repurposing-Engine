export interface RepurposedContent {
  twitter: string;
  instagram: string;
  linkedin: string;
  reels: string;
  telegram: string;
}

export type PlatformKey = keyof RepurposedContent;

export interface Platform {
  key: PlatformKey;
  label: string;
  icon: string;
  maxChars: number;
  color: string;
}
