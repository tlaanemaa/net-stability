"use client";
import { usePingStore } from "../store/pingStore";

export default function WarmupBanner() {
  const pings = usePingStore((state) => state.pings);

  if (pings.length > 1) return null;
  return (
    <div className="fixed flex inset-0 bg-main-color items-center justify-center text-5xl text-accent-color red-text-glow">
      <span className="animate-pulse">Starting...</span>
    </div>
  );
}
