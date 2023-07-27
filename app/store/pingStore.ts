import { create } from "zustand";

const measureTime = async () => {
  const start = performance.now();
  await fetch("/api/ping", { method: "HEAD" });
  return performance.now() - start;
};

interface PingState {
  pings: number[];
  addPing(value: number): void;

  timer: null | NodeJS.Timeout;
  startPinging(): void;
  stopPinging(): void;
}

export const usePingStore = create<PingState>((set, get) => ({
  pings: [],

  addPing(value: number) {
    set((state) => ({ pings: [...state.pings, value] }));
  },

  timer: null,

  startPinging() {
    get().stopPinging();

    const timer = setInterval(async () => {
      const time = await measureTime();
      set(({ pings }) => ({ pings: [...pings, time] }));
    }, 1000);

    set(() => ({ timer }));
  },

  stopPinging() {
    const oldTimer = get().timer;
    if (oldTimer) clearTimeout(oldTimer);
    set(() => ({ timer: null }));
  },
}));
