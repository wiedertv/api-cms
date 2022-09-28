import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AdminInterceptor } from '../auth/auth.interceptor'
import { GqlAuthGuard } from '../auth/graphql-auth.guard'
import { User as CurrentUser } from '../decorators/user.decorator'
import { DeleteEventDto, EventsDto, EventsInputDto, EventResponseDto } from '../DTO/events/events.dto'

import { UpdateEventsDto } from '../DTO/events/updateEvents.dto'
import { PermissionGuard } from '../middlewares/permission.middleware'
import { EventsService } from './events.service'
import { DownloadDataDto, DownloadTableDto } from '../DTO/members/downloadTableDto'

@Resolver('Events')
export class EventsResolver {
  constructor (private readonly eventsService: EventsService) {}
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @SetMetadata('type', 'event')
  @Query(() => EventResponseDto)
  async getAllEvents (
    @CurrentUser() user,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
    @Args('order', { type: () => [String], nullable: true }) order = ['id', 'ASC'],
    @Args('key', { type: () => String, nullable: true }) key,
    @Args('filter', { type: () => String, nullable: true }) filter = ''
  ) {
    if (key) {
      return await this.eventsService.getAll(offset, limit, order, filter, user.role, key)
    }
    return await this.eventsService.getAll(offset, limit, order, filter, user.role)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => EventsDto)
  async getOneEvent (@CurrentUser() user, @Args('id', { type: () => Int }) id: number): Promise<EventsDto> {
    return await this.eventsService.getOne(id)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => EventsDto)
  async createEvent (@Args('payload', { type: () => EventsInputDto }) payload: EventsInputDto) {
    return await this.eventsService.create(payload)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => EventsDto)
  async updateEvent (@Args('payload', { type: () => UpdateEventsDto }) payload: UpdateEventsDto): Promise<EventsDto> {
    return await this.eventsService.update(payload)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => DeleteEventDto)
  async deleteEvent (@Args('id', { type: () => Int }) id: number): Promise<DeleteEventDto> {
    return await this.eventsService.delete(id)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DownloadTableDto)
  downloadEventsAsCsv (@Args('payload', { type: () => DownloadDataDto }) payload: DownloadDataDto) {
    return this.eventsService.downloadEvents(payload)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [EventsDto])
  async getFutureEvents (): Promise<EventsDto[]> {
    return await this.eventsService.getFutureEvent()
  }
}
