import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

/**
 * An interceptors which sends back the resource type  upon a successful POST, PATCH, or delete request.
 */
@Injectable()
export class SuccessChangeInterceptor implements NestInterceptor {
  private readonly requestMethods = ['POST', 'PATCH', 'DELETE'];

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const resourceName = this.reflector.get<string>(
      'resource-name',
      context.getHandler()
    );

    if (!this.requestMethods.includes(request.method)) {
      return next.handle();
    }

    return next.handle().pipe(
      map(() => {
        let message: string;
        switch (request.method) {
          case 'POST':
            message = `${resourceName} successfully created!`;
            break;
          case 'PATCH':
            message = `${resourceName} successfully updated!`;
            break;
          case 'DELETE':
            message = `${resourceName} successfully deleted!`;
            break;
        }

        return {
          statusCode: this.getStatusCode(request.method),
          message,
        };
      })
    );
  }

  private getStatusCode(method: string) {
    switch (method) {
      case 'POST':
        return HttpStatus.CREATED;
      case 'PATCH':
        return HttpStatus.OK;
      case 'DELETE':
        return HttpStatus.OK;
    }
  }
}
