import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DrawMessage } from '../interfaces/Messages';
import { Canvas, CanvasDocument } from './canvas.schema';
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
    @InjectModel(Canvas.name)
    private canvasModel: Model<CanvasDocument>,
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

  getCanvas() {
    return this.canvas;
  }

  setColors(newColors: number[][]): void {
    this.colors = newColors;
  }

  clearCanvas() {
    this.generateCanvas();
  }

  /**
   * Save current canvas and history in the database.
   */
  async saveCanvas() {
    console.log('Saving canvas...');

    const createdCanvasBackup = new this.canvasModel({
      timestamp: Date.now(),
      image: this.canvas,
      history: this.history,
      config: this.configService.getConfig(),
    });
  }

  /**
   * Load latest canvas and history from database.
   */
  loadCanvas() {
    console.log('Loading canvas...');
  }
}
