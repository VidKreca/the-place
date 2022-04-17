import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

const TOKEN = '894uztjmnsdfgsdfklgjh9384u5msdnfgsdfgopi134598';

@Controller('admin')
export class AdminController {
  @Post()
  @HttpCode(200)
  authorize(@Query('token') token: string): void {
    console.log(`Authorizing with: ${token}`);
    if (token !== TOKEN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
