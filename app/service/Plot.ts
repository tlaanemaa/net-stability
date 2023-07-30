import resolveConfig from "tailwindcss/resolveConfig";
import { Ping } from "../store/pingStore";
import tailwindConfig from "../../tailwind.config";

const theme = resolveConfig(tailwindConfig).theme!;
const COLORS = {
  accent: theme.colors!["accent-color"] as string,
  fadedAccent: theme.colors!["highlight-color"] as string,
  grid: theme.colors!["grid-color"] as string,
  gridLabel: theme.colors!["grid-label-color"] as string,
} as const;

// TODO: Look into using ChartJS: https://www.npmjs.com/package/chart.js
export class Plot {
  /**
   * Plot config
   */
  private readonly config = {
    verticalMargin: 0.1,
    rightMargin: 50, //px
    lineWidth: 7,
    lineColor: COLORS.accent,
    gridColor: COLORS.grid,
    gridWidth: 1,
    labelColor: COLORS.gridLabel,
    labelFont: "1.5rem Arial",
    labelPadding: 5, // Padding from the right edge of the canvas,
    approxGridLineCount: 5,
    xLabelInterval: 5, // Show a label for every 5th ping
    xLabelColor: COLORS.gridLabel,
    xLabelFont: "1.5rem Arial",
    xLabelPadding: 10, // Padding from the bottom edge of the canvas
    maxLabels: 10, // Maximum number of x-axis labels
    errorMarkerText: "💀",
    errorMarkerFont: "1.5rem Arial",
    errorMarkerColor: COLORS.accent,
    glowColor: COLORS.accent,
    glowBlur: 10,
  } as const;

  constructor(private readonly canvas: HTMLCanvasElement) {}

  private roundToNearestFive(num: number): number {
    return Math.round(num / 5) * 5;
  }

  private roundToPleasantNumber(num: number): number {
    let magnitude = Math.pow(10, Math.floor(Math.log10(num)));
    let remainder = num / magnitude;

    if (remainder < 1.5) {
      return magnitude;
    } else if (remainder < 3.5) {
      return 2 * magnitude;
    } else if (remainder < 7.5) {
      return 5 * magnitude;
    } else {
      return 10 * magnitude;
    }
  }

  public draw(rawPings: Ping[]) {
    if (rawPings.length < 1) return;

    // Sort the pings array by timestamp
    const pings = rawPings.sort((a, b) => a.ts.getTime() - b.ts.getTime());

    const ctx = this.canvas.getContext("2d")!;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas

    const margin = this.config.verticalMargin * this.canvas.height;

    // Get the maximum and minimum ping values without spread operator
    let maxPing = -Infinity,
      minPing = Infinity;
    for (let i = 0; i < pings.length; i++) {
      maxPing = pings[i].latency > maxPing ? pings[i].latency : maxPing;
      minPing = pings[i].latency < minPing ? pings[i].latency : minPing;
    }

    const range = maxPing - minPing; // Range of ping values

    // Determine the grid size based on the range
    const gridSize = this.roundToPleasantNumber(
      range / this.config.approxGridLineCount
    ); // Adjust the divisor as needed

    // Calculate the scaling factors for x and y axes
    const xScale =
      (this.canvas.width - this.config.rightMargin) /
      Math.max(pings.length - 1, 1);
    const yScale = (this.canvas.height - 2 * margin) / (range || 1);

    // Calculate y-coordinates for all pings
    const yCoordinates = new Array(pings.length);
    for (let i = 0; i < pings.length; i++) {
      yCoordinates[i] =
        this.canvas.height - margin - (pings[i].latency - minPing) * yScale;
    }

    // Draw the grid lines and labels
    ctx.beginPath();
    ctx.strokeStyle = this.config.gridColor;
    ctx.lineWidth = this.config.gridWidth;
    ctx.font = this.config.labelFont;
    ctx.fillStyle = this.config.labelColor;
    ctx.textAlign = "right";
    for (
      let i = Math.ceil(minPing / gridSize) * gridSize;
      i < maxPing;
      i += gridSize
    ) {
      const y = this.canvas.height - margin - (i - minPing) * yScale;
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.fillText(
        i.toFixed(0),
        this.canvas.width - this.config.labelPadding,
        y - 5
      ); // Draw the label 5 pixels above the line
    }
    ctx.stroke();

    // Turn on the glow effect
    ctx.shadowColor = this.config.glowColor;
    ctx.shadowBlur = this.config.glowBlur;

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(0, yCoordinates[0]);
    for (let i = 1; i < pings.length; i++) {
      ctx.lineTo(i * xScale, yCoordinates[i]);
    }
    ctx.lineWidth = this.config.lineWidth; // Make the line thicker
    ctx.strokeStyle = this.config.lineColor; // Set the line color
    ctx.stroke(); // Draw the line

    // Turn off the glow effect
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Draw the x-axis labels
    ctx.textAlign = "center";
    ctx.fillStyle = this.config.xLabelColor;
    ctx.font = this.config.xLabelFont;

    // Calculate the interval between labels
    const maxLabels = Math.min(this.config.maxLabels, this.canvas.width / 250);
    const labelInterval = Math.round(Math.max(pings.length / maxLabels, 1));

    for (let i = 0; i < pings.length; i += labelInterval) {
      const x = i * xScale;

      // Adjust the text alignment based on the position
      if (i === 0) {
        ctx.textAlign = "left";
      } else {
        ctx.textAlign = "center";
      }

      ctx.fillText(
        pings[i].ts.toLocaleTimeString(),
        x,
        this.canvas.height - this.config.xLabelPadding
      );
    }

    // Draw the error markers
    ctx.font = this.config.errorMarkerFont; // Adjust the size as needed
    ctx.fillStyle = this.config.errorMarkerColor; // Set the color to red
    ctx.textAlign = "center";
    for (let i = 0; i < pings.length; i++) {
      if (pings[i].error) {
        const x = i * xScale;
        const y = yCoordinates[i];
        ctx.fillText(this.config.errorMarkerText, x, y);
      }
    }
  }
}
