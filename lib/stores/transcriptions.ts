import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Item = {
  id: string;
  filename: string;
  dateTime: string;
  transcription: string;
};

type State = {
  items: Item[];
  count: number;
};

type Actions = {
  add: (newItem: Pick<Item, "id" | "filename" | "transcription">) => void;
  delete: (id: string) => void;
};

export const useTranscriptions = create<State & Actions>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      add: (newItem) => {
        let _items = get().items;
        const _count = _items.unshift({ ...newItem, dateTime: new Date().toLocaleString() });
        set({ items: _items, count: _count });
      },
      delete: (id) => {
        let _items = get().items;
        _items = _items.filter((item) => item.id !== id);
        const _count = _items.length;
        set({ items: _items, count: _count });
      },
    }),
    {
      name: "whisper-transcriptions",
      version: 0,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
