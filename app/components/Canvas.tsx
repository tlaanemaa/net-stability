"use client";
import { useEffect, useState, useRef } from "react";
import { pinger } from "../service/pinger";

export default function Canvas() {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={(ref) => pinger.setElement(ref)}
      height={height}
      width={width}
    ></canvas>
  );
}
