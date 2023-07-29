"use client";
import { usePingStore } from "../store/pingStore";

export default function Intro() {
  const start = usePingStore((state) => state.startPinging);
  const started = usePingStore((state) => state.timer) !== null;
  if (started) return null;

  return (
    <div className="fixed flex inset-0 bg-main-color justify-center items-center z-10">
      <div className="max-w-screen-md rounded-md bg-main-color p-6 m-4 text-accent-color shadow-lg">
        <h1 className="text-4xl text-center mb-5 font-bold text-accent-color">
          Welcome to PingBeat!
        </h1>
        <p className="text-center text-xl">
          Curious about your network's reliability? PingBeat has got you
          covered! It sends a HEAD request to the closest edge server every
          second, measures the latency, and plots the results on an intuitive
          line graph. Gain a real-time, simple, and comprehensive view of your
          network stability with PingBeat.
        </p>
        <p className="text-center mt-5 text-lg">
          Note: Failed requests are marked with a 💀 symbol.
        </p>
        <button
          className="bg-accent-color hover:bg-faded-accent-color active:bg-faded-accent-color mt-6 w-full rounded-md p-3 transition duration-200 ease-in-out transform text-2xl font-bold shadow-md border-accent-color text-main-color"
          onClick={start}
        >
          Start Now
        </button>
      </div>
    </div>
  );
}
