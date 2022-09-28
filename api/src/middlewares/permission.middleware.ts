import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PermissionsEnum } from '../DTO/enums/permissions.enum'
import { RoleEnum } from '../DTO/enums/role.enum'
import { PermissionsService } from '../permissions/permissions.service'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor (
    @Inject(forwardRef(() => PermissionsService)) private readonly permissionsService: PermissionsService,
    private readonly reflector: Reflector
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const { user } = ctx.getContext().req
    if (user.role === RoleEnum.Admin) return true
    const pt = this.reflector.get<string>('type', context.getHandler())
    let name
    switch (pt) {
      case 'event':
        name = PermissionsEnum.events
        break
      case 'entries':
        name = PermissionsEnum.entries
        break
      case 'news':
        name = PermissionsEnum.news
        break
      case 'schedule':
        name = PermissionsEnum.scheduleAppointment
        break
    }
    const { allowed } = await this.permissionsService.getOne(name)
    if (!allowed[user.role]) throw new ForbiddenException()

    return true
  }
}
