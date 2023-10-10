import { create } from "zustand";

type State = {
  isNavMobileOpen: boolean;
};

type Actions = {
  toggleNavMobile: () => void;
};

export const useUI = create<State & Actions>((set) => ({
  isNavMobileOpen: false,
  toggleNavMobile: () => set((state) => ({ isNavMobileOpen: !state.isNavMobileOpen })),
}));
