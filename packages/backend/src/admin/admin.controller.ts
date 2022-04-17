import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { CanvasService } from '../canvas/canvas.service';
import { PlaceGateway } from '../socket/place.gateway';
import { TimeoutService } from '../timeout/timeout.service';
import { AdminGuard } from './admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private canvasService: CanvasService,
    private timeoutService: TimeoutService,
    private placeGateway: PlaceGateway,
  ) {}

  @Get()
  getConfig() {
    const canvasConfig = this.canvasService.getConfig();
    const timeoutDuration = this.timeoutService.timeoutDuration;
    return { ...canvasConfig, timeoutDuration };
  }

  @Put()
  modifyConfig(@Body() body) {
    // Size
    // TODO

    // Colors
    if (body.colors) this.canvasService.setColors(body.colors);

    // Timeout
    if (body.timeoutDuration)
      this.timeoutService.setTimeout(body.timeoutDuration);

    // Actions
    if (body.actions) {
      const { actions } = body;
      if (actions.includes('clear')) {
        this.canvasService.clearCanvas();
      }
    }

    this.placeGateway.sendUpdatedConfig();
  }
}
