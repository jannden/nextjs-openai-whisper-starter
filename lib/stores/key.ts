import { create } from "zustand";

type State = {
  key: string;
};

type Actions = {
  setKey: (key: string) => void;
};

export const useKey = create<State & Actions>((set) => ({
  key: "",
  setKey: (key) => set({ key }),
}));
