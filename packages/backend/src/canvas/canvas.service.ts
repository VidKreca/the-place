import { Injectable } from '@nestjs/common';
import { Color, DrawMessage } from '../interfaces/Messages';

const DIMENSIONS = { width: 100, height: 100 };

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
    if (!Array.isArray(data.color) || data.color.length !== 3) return false;

    this.canvas[data.x][data.y] = data.color;
    this.history.push(data);

    return true;
  }

  getConfig() {
    return { width: DIMENSIONS.width, height: DIMENSIONS.height };
  }

  getCanvas() {
    return this.canvas;
  }
}
