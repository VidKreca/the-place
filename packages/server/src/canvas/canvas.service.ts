import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DrawMessage } from '../interfaces/Messages';
import { ConfigService } from '../config/config.service';

@Injectable()
export class CanvasService {
  private canvas: number[][][];
  private history: DrawMessage[] = [];
  private dimensions = { width: 100, height: 100 };
  private colors: number[][] = [
    [0, 0, 0],
    [255, 255, 255],
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
  ];

  constructor(
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,
  ) {
    // Create 2D array for colors
    this.generateCanvas();
  }

  generateCanvas(color = [255, 255, 255]) {
    this.canvas = new Array(this.dimensions.width);
    for (let i = 0; i < this.canvas.length; i++) {
      this.canvas[i] = new Array(this.dimensions.height).fill(color);
    }
  }

  place(data: DrawMessage): boolean {
    if (!this.isValidColor(data.color)) return false;

    if (data.x < 0 || data.x > this.dimensions.width - 1) return false;
    if (data.y < 0 || data.y > this.dimensions.height - 1) return false;

    this.canvas[data.x][data.y] = data.color;
    this.history.push(data);

    return true;
  }

  isValidColor(color): boolean {
    if (!Array.isArray(color) || color.length !== 3) return false;
    if (!this.colors.find((x) => JSON.stringify(x) === JSON.stringify(color)))
      return false;
    return true;
  }

  getConfig() {
    return {
      width: this.dimensions.width,
      height: this.dimensions.height,
      colors: this.colors,
    };
  }

  getHistory() {
    return this.history;
  }

  setHistory(value: DrawMessage[]) {
    this.history = value;
  }

  getCanvas() {
    return this.canvas;
  }

  setCanvas(value: number[][][]) {
    this.canvas = value;
  }

  setColors(newColors: number[][]) {
    this.colors = newColors;
  }

  clearCanvas() {
    this.generateCanvas();
  }
}
