export enum ArtStyle {
  HAND_DRAWN = 'Hand-Drawn Doodle',
  WATERCOLOR = 'Dreamy Watercolor',
  CYBERPUNK = 'Cyberpunk Neon',
  TOY_CLAY = '3D Toy & Clay',
  PIXEL_ART = 'Retro Pixel Art',
  BOTANICAL = 'Elegant Botanical'
}

export interface StyleConfig {
  id: ArtStyle;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  color: string;
}

export interface PromptResponse {
  prompt: string;
}
