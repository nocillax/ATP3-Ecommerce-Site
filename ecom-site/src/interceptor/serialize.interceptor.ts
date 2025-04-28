import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer';
  import { Observable, map } from 'rxjs';
  
  @Injectable()
  export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          return instanceToPlain(data);
        }),
      );
    }
  }
  