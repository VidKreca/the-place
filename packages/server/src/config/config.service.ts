import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CanvasService } from '../canvas/canvas.service';
import { Config } from '../interfaces/Config';
import { TimeoutService } from '../timeout/timeout.service';
import { PlaceGateway } from '../socket/place.gateway';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(forwardRef(() => CanvasService))
    private canvasService: CanvasService,
    private timeoutService: TimeoutService,
    private placeGateway: PlaceGateway,
  ) {}

  getConfig() {
    const canvasConfig = this.canvasService.getConfig();
    const timeoutDuration = this.timeoutService.timeoutDuration;
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
      this.timeoutService.setTimeout(config.timeoutDuration);
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
}
