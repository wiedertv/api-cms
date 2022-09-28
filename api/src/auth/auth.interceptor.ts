import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { RoleEnum } from '../DTO/enums/role.enum'

@Injectable()
export class AdminInterceptor implements NestInterceptor {
  intercept (context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context)
    const user = ctx.getContext().req.user
    if (user.role !== RoleEnum.Admin) {
      throw new UnauthorizedException({
        code: '[UNAUTHORIZED_BY_INTERCEPTOR]',
        message: '[AUTH]: You dont have permissions to invite another Administrator'
      })
    }
    return next.handle()
  }
}
