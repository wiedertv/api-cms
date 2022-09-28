import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate (context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()
    return super.canActivate(new ExecutionContextHost([req]))
  }
}
