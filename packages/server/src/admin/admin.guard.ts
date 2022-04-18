import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

const ADMIN_TOKEN = '894uztjmnsdfgsdfklgjh9384u5msdnfgsdfgopi134598';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request?.query?.token;

    if (token !== ADMIN_TOKEN) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
