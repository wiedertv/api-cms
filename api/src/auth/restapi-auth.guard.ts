import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { RoleEnum } from '../DTO/enums/role.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  private request;
  private context: ExecutionContext;

  canActivate (context: ExecutionContext): boolean {
    this.context = context
    this.request = context.switchToHttp().getRequest()
    const { user } = this.request
    if (user.role === RoleEnum.Admin) return true
  }
}
