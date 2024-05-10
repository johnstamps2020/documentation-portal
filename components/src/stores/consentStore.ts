import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConsentState {
  aiConsented: boolean;
  setAIConsented: (decision: ConsentState['aiConsented']) => void;
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      aiConsented: false,
      setAIConsented: (decision) => set({ aiConsented: decision }),
    }),
    { name: 'ai-consent-decision' }
  )
);
