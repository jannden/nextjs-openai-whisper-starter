import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type State = {
  prompt: string;
  maxPause: string;
  minDecibels: string;
  endpoint: string;
  language: string;
  temperature: string;
  saveFile: string;
};

export type Actions = {
  setPrompt: (val: string) => void;
  setMaxPause: (val: string) => void;
  setMinDecibels: (val: string) => void;
  setEndpoint: (val: string) => void;
  setLanguage: (val: string) => void;
  setTemperature: (val: string) => void;
  setSaveFile: (val: string) => void;
};

export const useSettings = create<State & Actions>()(
  persist(
    (set, get) => ({
      prompt: "",
      maxPause: "3500",
      minDecibels: "-40",
      endpoint: "transcriptions",
      language: "en",
      temperature: "0",
      saveFile: "false",
      setPrompt: (prompt) => set({ prompt }),
      setMaxPause: (maxPause) => set({ maxPause }),
      setMinDecibels: (minDecibels) => set({ minDecibels }),
      setEndpoint: (endpoint) => set({ endpoint }),
      setLanguage: (language) => set({ language }),
      setTemperature: (temperature) => set({ temperature }),
      setSaveFile: (saveFile) => set({ saveFile }),
    }),
    {
      name: "whisper-settings",
      version: 0,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
