import { create } from "zustand";

interface PingState {
  pings: number[];
  addPing: (value: number) => void;
}

export const usePingStore = create<PingState>((set) => ({
  pings: [],
  addPing(value: number) {
    set((state) => ({ pings: [...state.pings, value] }));
  },
}));

setInterval(() => {
  usePingStore.getState().addPing(Math.round(Math.random() * 180) + 20);
}, 1000);
