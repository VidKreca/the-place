import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CanvasService } from '../canvas/canvas.service';
import { Config } from '../interfaces/Config';
import { TimeoutService } from '../timeout/timeout.service';
import { PlaceGateway } from '../socket/place.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigDocument, ConfigSchemaObject } from './config.schema';
import config from '../config.json';

@Injectable()
export class ConfigService {
  lastChangesCount = 0;

  constructor(
    @InjectModel(ConfigSchemaObject.name)
    private canvasModel: Model<ConfigDocument>,
    @Inject(forwardRef(() => CanvasService))
    private canvasService: CanvasService,
    private timeoutService: TimeoutService,
    private placeGateway: PlaceGateway,
  ) {
    this.loadFromDatabase();

    setInterval(() => {
      if (
        this.canvasService.getHistory().length - this.lastChangesCount >
        config.minimum_changes_between_db_saves
      ) {
        this.saveToDatabase();
      }
    }, config.seconds_between_db_save * 1000);
  }

  getConfig() {
    const canvasConfig = this.canvasService.getConfig();
    const timeoutDuration = this.timeoutService.timeout;
    return { ...canvasConfig, timeoutDuration };
  }

  setConfig(config: Config) {
    // Size
    // TODO

    // Colors
    if (config.colors) {
      this.canvasService.setColors(config.colors);
    }

    // Timeout
    if (config.timeoutDuration) {
      this.timeoutService.timeout = config.timeoutDuration;
    }

    // Actions
    if (config.actions) {
      const { actions } = config;
      if (actions.includes('clear')) {
        this.canvasService.clearCanvas();
      }
    }

    this.placeGateway.sendUpdatedConfig();
  }

  /**
   * Save current canvas and history in the database.
   */
  async saveToDatabase() {
    console.log('%cSaving to database...', 'color: blue');

    const createdCanvasBackup = new this.canvasModel({
      timestamp: Date.now(),
      image: this.canvasService.getCanvas(),
      history: this.canvasService.getHistory(),
      config: this.getConfig(),
    });
    await createdCanvasBackup.save();

    this.lastChangesCount = createdCanvasBackup.toObject().history.length;
  }

  /**
   * Load latest canvas and history from database.
   */
  async loadFromDatabase() {
    console.log('%cLoading from database...', 'color: blue');

    const newestSave = await this.canvasModel
      .findOne()
      .sort({ timestamp: -1 })
      .exec();

    if (newestSave) {
      console.log(
        `Loaded save from timestamp: ${newestSave.toObject().timestamp}`,
      );

      const save = newestSave.toObject();

      this.lastChangesCount = save.history.length;
      this.setConfig(save.config);
      this.canvasService.setHistory(save.history);
      this.canvasService.setCanvas(save.image);
    } else {
      console.log('No save found in database.');
    }
  }
}
