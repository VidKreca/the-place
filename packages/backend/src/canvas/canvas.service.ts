import { Injectable } from '@nestjs/common';
import { Color, DrawMessage } from '../interfaces/Messages';

const DIMENSIONS = { width: 10, height: 10 };

@Injectable()
export class CanvasService {
  private canvas: Color[][];
  private history: DrawMessage[] = [];

  constructor() {
    // Create 2D array for colors
    this.canvas = new Array(DIMENSIONS.width);
    for (let i = 0; i < this.canvas.length; i++) {
      this.canvas[i] = new Array(DIMENSIONS.height);
    }
  }

  place(data: DrawMessage) {
    this.canvas[data.x][data.y] = data.color;
    this.history.push(data);
  }

  getConfig() {
    return { width: DIMENSIONS.width, height: DIMENSIONS.height };
  }
}
