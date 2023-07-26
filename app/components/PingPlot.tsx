"use client";
import { useEffect, useState, useRef } from "react";
import { usePingStore } from "../store/pingStore";

// TODO: Use ChartJS: https://www.npmjs.com/package/chart.js

const PLOT_CONSTANTS = {
  verticalMargin: 0.1,
  rightMargin: 50, //px
  lineWidth: 5,
  lineColor: "red",
  gridColor: "darkred",
  gridWidth: 1,
  labelColor: "red",
  labelFont: "14px Arial",
  labelPadding: 5, // Padding from the right edge of the canvas,
  gridSizes: [
    { range: 60000, size: 20000 },
    { range: 30000, size: 10000 },
    { range: 15000, size: 5000 },
    { range: 6000, size: 2000 },
    { range: 3000, size: 1000 },
    { range: 1500, size: 500 },
    { range: 600, size: 200 },
    { range: 300, size: 100 },
    { range: 150, size: 50 },
    { range: 60, size: 20 },
    { range: 30, size: 10 },
    { range: 15, size: 5 },
    { range: 6, size: 2 },
    { range: 0, size: 1 }, // Default size
  ],
} as const;

const drawPingPlot = (canvas: HTMLCanvasElement, pings: number[]) => {
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  const margin = PLOT_CONSTANTS.verticalMargin * canvas.height;

  // Get the maximum and minimum ping values without spread operator
  let maxPing = -Infinity,
    minPing = Infinity;
  for (let i = 0; i < pings.length; i++) {
    maxPing = pings[i] > maxPing ? pings[i] : maxPing;
    minPing = pings[i] < minPing ? pings[i] : minPing;
  }

  const range = maxPing - minPing; // Range of ping values

  // Determine the grid size based on the range
  const gridSize =
    PLOT_CONSTANTS.gridSizes.find((size) => range > size.range)?.size ?? 1;

  // Calculate the scaling factors for x and y axes
  const xScale =
    (canvas.width - PLOT_CONSTANTS.rightMargin) / Math.max(pings.length - 1, 1);
  const yScale = (canvas.height - 2 * margin) / (range || 1);

  // Add a glow effect
  ctx.shadowColor = "red";
  ctx.shadowBlur = 10;

  // Calculate y-coordinates for all pings
  const yCoordinates = new Array(pings.length);
  for (let i = 0; i < pings.length; i++) {
    yCoordinates[i] = canvas.height - margin - (pings[i] - minPing) * yScale;
  }

  // Draw the grid lines and labels
  ctx.beginPath();
  ctx.strokeStyle = PLOT_CONSTANTS.gridColor;
  ctx.lineWidth = PLOT_CONSTANTS.gridWidth;
  ctx.font = PLOT_CONSTANTS.labelFont;
  ctx.fillStyle = PLOT_CONSTANTS.labelColor;
  ctx.textAlign = "right";
  for (
    let i = Math.ceil(minPing / gridSize) * gridSize;
    i < maxPing;
    i += gridSize
  ) {
    const y = canvas.height - margin - (i - minPing) * yScale;
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.fillText(
      i.toFixed(0),
      canvas.width - PLOT_CONSTANTS.labelPadding,
      y - 5
    ); // Draw the label 5 pixels above the line
  }
  ctx.stroke();

  // Draw the line
  ctx.beginPath();
  ctx.moveTo(0, yCoordinates[0]);
  for (let i = 1; i < pings.length; i++) {
    ctx.lineTo(i * xScale, yCoordinates[i]);
  }
  ctx.lineWidth = PLOT_CONSTANTS.lineWidth; // Make the line thicker
  ctx.strokeStyle = PLOT_CONSTANTS.lineColor; // Set the line color
  ctx.stroke(); // Draw the line
};

export default function PingPlot() {
  const [height, setHeight] = useState(600);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    const portrait = window.matchMedia("(orientation: portrait)");
    portrait.addEventListener("change", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      portrait.removeEventListener("change", handleResize);
    };
  }, []);

  const canvasRef = useRef(null);
  const pings = usePingStore((state) => state.pings);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    drawPingPlot(canvas, pings);
  }, [pings, height, width]);

  return (
    <div>
      {pings.length <= 1 && (
        <div className="fixed flex inset-0 items-center justify-center text-5xl text-red-700 red-text-glow">
          Starting...
        </div>
      )}
      <canvas ref={canvasRef} height={height} width={width}></canvas>
    </div>
  );
}
