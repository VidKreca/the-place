import { Injectable } from '@nestjs/common';
import { Color, DrawMessage } from '../interfaces/Messages';

const DIMENSIONS = { width: 100, height: 100 };
const COLORS = [
  [0, 0, 0],
  [255, 255, 255],
  [255, 0, 0],
  [0, 255, 0],
  [0, 0, 255],
];

@Injectable()
export class CanvasService {
  private canvas: Color[][];
  private history: DrawMessage[] = [];

  constructor() {
    // Create 2D array for colors
    this.canvas = new Array(DIMENSIONS.width);
    for (let i = 0; i < this.canvas.length; i++) {
      this.canvas[i] = new Array(DIMENSIONS.height).fill([255, 255, 255]);
    }
  }

  place(data: DrawMessage): boolean {
    if (!this.isValidColor(data.color)) return false;

    if (data.x < 0 || data.x > DIMENSIONS.width - 1) return false;
    if (data.y < 0 || data.y > DIMENSIONS.height - 1) return false;

    this.canvas[data.x][data.y] = data.color;
    this.history.push(data);

    return true;
  }

  isValidColor(color): boolean {
    if (!Array.isArray(color) || color.length !== 3) return false;
    if (!COLORS.find((x) => JSON.stringify(x) === JSON.stringify(color)))
      return false;
    return true;
  }

  getConfig() {
    return {
      width: DIMENSIONS.width,
      height: DIMENSIONS.height,
      colors: COLORS,
    };
  }

  getCanvas() {
    return this.canvas;
  }
}
