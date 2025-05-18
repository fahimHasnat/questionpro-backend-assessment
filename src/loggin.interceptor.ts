import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const startTime = Date.now();

    const logStart = {
      event: 'request',
      method,
      url,
      timestamp: new Date(startTime).toISOString(),
    };
    console.log(JSON.stringify(logStart));

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const logEnd = {
          event: 'response',
          method,
          url,
          executionTime: `${endTime - startTime}ms`,
          timestamp: new Date(endTime).toISOString(),
        };
        console.log(JSON.stringify(logEnd));
      }),
    );
  }
}
