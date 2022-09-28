import { UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AdminInterceptor } from '../auth/auth.interceptor'
import { GqlAuthGuard } from '../auth/graphql-auth.guard'
import { PermissionsDto, PermissionsInputDto } from '../DTO/permissions/permissions.dto'
import { PermissionsService } from './permissions.service'

@Resolver('Permissions')
export class PermissionsResolver {
  constructor (private readonly permissionsService: PermissionsService) {}

  @Query(() => [PermissionsDto])
  async getPermissions (): Promise<PermissionsDto[]> {
    return await this.permissionsService.get()
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => [PermissionsDto])
  async updatePermissions (
    @Args('input', { type: () => [PermissionsInputDto!]! })
      input: PermissionsInputDto[]
  ): Promise<PermissionsDto[]> {
    return await this.permissionsService.update(input)
  }
}
