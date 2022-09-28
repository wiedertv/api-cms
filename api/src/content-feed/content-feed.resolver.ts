import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AdminInterceptor } from '../auth/auth.interceptor'
import { GqlAuthGuard } from '../auth/graphql-auth.guard'
import { User as CurrentUser } from '../decorators/user.decorator'
import { CreateContentFeedDto } from '../DTO/contentFeed/createContentFeed.dto'
import { DeleteContentFeedDto } from '../DTO/contentFeed/deleteContentFeed.dto'
import { ContentFeedDto, GetAllContentFeedDto } from '../DTO/contentFeed/getContentFeed.dto'
import { UpdateContentFeedDto } from '../DTO/contentFeed/updateContentFeed.dto'
import { PermissionGuard } from '../middlewares/permission.middleware'
import { ContentFeedService } from './content-feed.service'
import { DownloadDataDto, DownloadTableDto } from '../DTO/members/downloadTableDto'

@Resolver('ContentFeed')
export class ContentFeedResolver {
  constructor (private readonly contentFeedService: ContentFeedService) {}

  @UseGuards(GqlAuthGuard, PermissionGuard)
  @SetMetadata('type', 'entries')
  @Query(() => GetAllContentFeedDto)
  async getAllContentFeed (
    @CurrentUser() user,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
    @Args('order', { type: () => [String], nullable: true }) order = ['id', 'ASC'],
    @Args('key', { type: () => String, nullable: true }) key,
    @Args('filter', { type: () => [String], nullable: true }) filter = []
  ): Promise<GetAllContentFeedDto> {
    if (key) {
      return await this.contentFeedService.getAll(offset, limit, order, filter, user.role, key)
    }
    return await this.contentFeedService.getAll(offset, limit, order, filter, user.role)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ContentFeedDto)
  async getOneContentFeed (@Args('id', { type: () => Int }) id: number) {
    return await this.contentFeedService.getOne(id)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => ContentFeedDto)
  async createContentFeed (@Args('payload', { type: () => CreateContentFeedDto }) payload: CreateContentFeedDto): Promise<ContentFeedDto> {
    return await this.contentFeedService.create(payload)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => ContentFeedDto)
  async updateContentFeed (@Args('payload', { type: () => UpdateContentFeedDto }) payload: UpdateContentFeedDto): Promise<ContentFeedDto> {
    return await this.contentFeedService.update(payload)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => DeleteContentFeedDto)
  async deleteContentFeed (@Args('id', { type: () => Int }) id: number): Promise<DeleteContentFeedDto> {
    return await this.contentFeedService.delete(id)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => DownloadTableDto)
  async downloadEntriesAsCsv (@Args('payload', { type: () => DownloadDataDto }) payload: DownloadDataDto) {
    return this.contentFeedService.downloadEntries(payload)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ContentFeedDto])
  async getFutureEntries (): Promise<ContentFeedDto[]> {
    return await this.contentFeedService.getFutureEntries()
  }
}
