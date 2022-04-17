import { Controller, Get, UseGuards } from '@nestjs/common';
import { CanvasService } from '../canvas/canvas.service';
import { TimeoutService } from '../timeout/timeout.service';
import { AdminGuard } from './admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private canvasService: CanvasService,
    private timeoutService: TimeoutService,
  ) {}

  @Get()
  getConfig() {
    const canvasConfig = this.canvasService.getConfig();
    const timeoutDuration = this.timeoutService.timeoutDuration;
    return { ...canvasConfig, timeoutDuration };
  }
}
