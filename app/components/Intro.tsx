"use client";
import { usePingStore } from "../store/pingStore";

export default function Intro() {
  const start = usePingStore((state) => state.startPinging);
  const started = usePingStore((state) => state.timer) !== null;
  if (started) return null;

  return (
    <div className="fixed flex inset-0 bg-opacity-30 bg-black justify-center items-center z-10">
      <div className="max-w-screen-md border-2 rounded-md border-red-700 bg-blue-950 p-4 text-red-700 red-text-glow">
        <h1 className="text-2xl text-center mb-3">
          Welcome to PingBeat - Your Personal Network Latency Dashboard
        </h1>
        <p className="text-center">
          Ever wondered about your network's reliability? PingBeat is here to
          help! Our tool sends a HEAD request to the closest edge server every
          second, measuring the latency and plotting the results on a
          user-friendly line graph. With PingBeat, you gain a real-time, simple,
          yet comprehensive overview of your network stability.
        </p>
        <button
          className="bg-blue-900 hover:bg-blue-800 active:bg-blue-700 mt-5 w-full rounded-md p-2 transition duration-200 ease-in-out transform"
          onClick={start}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
