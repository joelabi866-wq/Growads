export interface ChatConfig {
  whatsapp: string;
  telegram: string;
  aiChat?: boolean; // false when the backend has no Groq key configured
}
