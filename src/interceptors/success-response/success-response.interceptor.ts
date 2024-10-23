import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    if (request.method === 'GET') {
      return next.handle().pipe(
        map((data) => ({
          statusCode: 200,
          message: 'success',
          data,
        }))
      );
    }

    return next.handle();
  }
}
