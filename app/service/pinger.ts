class Pinger {
  private element: HTMLCanvasElement | null = null;

  constructor() {
    setInterval(() => {
      const ctx = this?.element?.getContext("2d");
      if (!ctx || !this.element) return;
      const x = Math.round(Math.random() * this.element.width);
      const y = Math.round(Math.random() * this.element.height);
      const r = Math.round(Math.random() * 18) + 2;

      ctx.fillStyle = "#FF0000";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
    }, 200);
  }

  public setElement(element: HTMLCanvasElement | null) {
    this.element = element;
  }
}

export const pinger = new Pinger();
