import { create } from "zustand";

export interface Ping {
  ts: Date;
  latency: number;
  error: boolean;
}

const measureTime = async (): Promise<Ping> => {
  const ts = new Date();
  let error = false;
  const start = performance.now();

  try {
    await fetch("/api/ping", { method: "HEAD" });
  } catch (e) {
    error = true;
  }

  const end = performance.now();
  return { ts, error, latency: end - start };
};

interface PingState {
  pings: Ping[];
  addPing(value: Ping): void;

  timer: null | NodeJS.Timeout;
  startPinging(): void;
  stopPinging(): void;
}

export const usePingStore = create<PingState>((set, get) => ({
  pings: [],

  addPing(value: Ping) {
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
