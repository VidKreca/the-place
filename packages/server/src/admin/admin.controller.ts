import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { PlaceGateway } from '../socket/place.gateway';
import { AdminGuard } from './admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private configService: ConfigService,
    private placeGateway: PlaceGateway,
  ) {}

  @Get()
  getConfig() {
    return this.configService.getConfig();
  }

  @Put()
  modifyConfig(@Body() body) {
    this.configService.setConfig({
      width: body.width,
      height: body.height,
      colors: body.colors,
      timeoutDuration: body.timeoutDuration,
      actions: body.actions,
    });

    this.placeGateway.sendUpdatedConfig();
  }
}
