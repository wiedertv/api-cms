import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AdminInterceptor } from '../auth/auth.interceptor'
import { GqlAuthGuard } from '../auth/graphql-auth.guard'
import { User as CurrentUser } from '../decorators/user.decorator'
import { MagazineInputDto } from '../DTO/magazine/createMagazine.dto'
import { DeleteMagazineDto } from '../DTO/magazine/deleteMagazine.dto'
import { AllMagazineResponseDto, MagazineDto } from '../DTO/magazine/getMagazine.dto'
import { UpdateMagazineInputDto } from '../DTO/magazine/updateMagazine.dto'
import { PermissionGuard } from '../middlewares/permission.middleware'
import { MagazineService } from './magazine.service'

@Resolver('Magazine')
export class MagazineResolver {
  constructor (private readonly magazineService: MagazineService) {}

  @Query(() => AllMagazineResponseDto)
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @SetMetadata('type', 'news')
  async getAllNews (
    @CurrentUser() user,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
    @Args('order', { type: () => [String], nullable: true }) order = ['id', 'ASC'],
    @Args('key', { type: () => String, nullable: true }) key,
    @Args('filter', { type: () => String, nullable: true }) filter = ''
  ) {
    if (key) {
      return await this.magazineService.getAll(offset, limit, order, filter, user.role, key)
    }
    return await this.magazineService.getAll(offset, limit, order, filter, user.role)
  }

  @Query(() => MagazineDto)
  @UseGuards(GqlAuthGuard)
  async getOneNews (@Args('id', { type: () => Int }) id: number) {
    return await this.magazineService.getOne(id)
  }

  @Mutation(() => MagazineDto)
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  async createNews (@Args('payload', { type: () => MagazineInputDto }) payload: MagazineInputDto) {
    return await this.magazineService.create(payload)
  }

  @Mutation(() => MagazineDto)
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  async updateNews (@Args('payload', { type: () => UpdateMagazineInputDto }) payload: UpdateMagazineInputDto) {
    return await this.magazineService.update(payload)
  }

  @Mutation(() => DeleteMagazineDto)
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  async deleteNews (@Args('id', { type: () => Int }) id: number) {
    return await this.magazineService.delete(id)
  }
}
