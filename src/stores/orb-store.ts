import { create } from "zustand";

interface OrbMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface OrbState {
  isOpen: boolean;
  isLoading: boolean;
  messages: OrbMessage[];
  inputValue: string;
  
  // Actions
  openOrb: () => void;
  closeOrb: () => void;
  toggleOrb: () => void;
  setInputValue: (value: string) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

// Stub responses for the AI Orb
const STUB_RESPONSES: Record<string, string> = {
  default: "Welcome to ProjectX OS. I'm NEXUS, your AI guide. How can I assist your journey?",
  help: "You can explore the OS, complete missions to earn XP, or discover hidden secrets. Try clicking around!",
  missions: "There are 4 missions available: Explorer, Trailer Watcher, OS Pioneer, and Secret Finder. Complete them to level up!",
  xp: "XP is earned by exploring, completing missions, and finding easter eggs. Level up to unlock new tiers!",
  secret: "Secrets are hidden throughout the experience. Keep exploring... the curious are rewarded. 🔮",
  hello: "Hello, traveler. Welcome to the age of human upgrade. What would you like to explore?",
  who: "I am NEXUS, an AI construct designed to guide visitors through ProjectX OS. I exist to help you discover your potential.",
};

function getStubResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes("help")) return STUB_RESPONSES.help;
  if (lowerInput.includes("mission")) return STUB_RESPONSES.missions;
  if (lowerInput.includes("xp") || lowerInput.includes("level")) return STUB_RESPONSES.xp;
  if (lowerInput.includes("secret") || lowerInput.includes("easter")) return STUB_RESPONSES.secret;
  if (lowerInput.includes("hello") || lowerInput.includes("hi")) return STUB_RESPONSES.hello;
  if (lowerInput.includes("who") || lowerInput.includes("what are you")) return STUB_RESPONSES.who;
  
  return STUB_RESPONSES.default;
}

export const useOrbStore = create<OrbState>((set, get) => ({
  isOpen: false,
  isLoading: false,
  messages: [],
  inputValue: "",

  openOrb: () => set({ isOpen: true }),
  closeOrb: () => set({ isOpen: false }),
  toggleOrb: () => set((state) => ({ isOpen: !state.isOpen })),
  
  setInputValue: (value: string) => set({ inputValue: value }),

  sendMessage: async (content: string) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    const userMessage: OrbMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedContent,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      inputValue: "",
      isLoading: true,
    }));

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const response = getStubResponse(trimmedContent);
    
    const assistantMessage: OrbMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, assistantMessage],
      isLoading: false,
    }));
  },

  clearMessages: () => set({ messages: [] }),
}));
