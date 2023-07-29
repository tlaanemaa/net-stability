"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { usePingStore } from "../store/pingStore";
import { Plot } from "../service/Plot";
import WarmupBanner from "./WarmupBanner";

// React component PingPlot
export default function PingPlot() {
  const [height, setHeight] = useState(600);
  const [width, setWidth] = useState(800);

  const handleResize = useCallback(() => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    const portrait = window.matchMedia("(orientation: portrait)");
    portrait.addEventListener("change", () => {
      // Add a delay to ensure the orientation change is complete before resizing
      setTimeout(handleResize, 200);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      portrait.removeEventListener("change", handleResize);
    };
  }, [handleResize]);

  const canvasRef = useRef(null);
  const pings = usePingStore((state) => state.pings);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const plot = new Plot(canvas);
    plot.draw(pings);
  }, [pings, height, width]);

  return (
    <div>
      <WarmupBanner />
      <canvas ref={canvasRef} height={height} width={width}></canvas>
    </div>
  );
}
