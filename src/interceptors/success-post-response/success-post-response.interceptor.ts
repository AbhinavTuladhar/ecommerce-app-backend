import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class SuccessPostResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    const resourceName = this.reflector.get<string>(
      'resource-name',
      context.getHandler()
    );

    if (request.method !== 'POST' || resourceName === undefined) {
      return next.handle();
    }

    return next.handle().pipe(
      map(() => ({
        statusCode: HttpStatus.CREATED,
        message: `${resourceName} successfully created!`,
      }))
    );
  }
}
