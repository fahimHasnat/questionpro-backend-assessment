import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, payload) {
    if (err || !payload) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return payload;
  }
}
