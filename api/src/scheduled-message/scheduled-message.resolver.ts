import { UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AdminInterceptor } from '../auth/auth.interceptor'
import { GqlAuthGuard } from '../auth/graphql-auth.guard'
import {
  DeleteScheduleMessageDto,
  GospelResponseDto,
  ScheduleMessageDto,
  ScheduleMessageInputDto,
  ScheduleMessageUpdateDto
} from '../DTO/scheduleMessage/scheduleMessage.dto'
import { ScheduledMessageService } from './scheduled-message.service'

@Resolver('ScheduledMessage')
export class ScheduledMessageResolver {
  constructor (private readonly gospelService: ScheduledMessageService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => GospelResponseDto)
  async getAllGospels (
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
    @Args('order', { type: () => [String], nullable: true }) order = ['id', 'ASC'],
    @Args('key', { type: () => String, nullable: true }) key
  ): Promise<GospelResponseDto> {
    if (key) {
      return await this.gospelService.getAll(offset, limit, order, key)
    }
    return await this.gospelService.getAll(offset, limit, order)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ScheduleMessageDto])
  async getFutureGospels (): Promise<ScheduleMessageDto[]> {
    return await this.gospelService.getFutureGospels()
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ScheduleMessageDto)
  async getOneGospel (@Args('id', { type: () => Int }) id: number): Promise<ScheduleMessageDto> {
    return await this.gospelService.getOneById(id)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ScheduleMessageDto])
  async getReleasedGospels () {
    return await this.gospelService.getReleasedGospel()
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => ScheduleMessageDto)
  async createGospel (
    @Args('payload', { type: () => ScheduleMessageInputDto })
      payload: ScheduleMessageInputDto
  ): Promise<ScheduleMessageDto> {
    return await this.gospelService.create(payload)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => ScheduleMessageDto)
  async updateGospel (
    @Args('payload', { type: () => ScheduleMessageUpdateDto })
      payload: ScheduleMessageUpdateDto
  ): Promise<ScheduleMessageDto> {
    return await this.gospelService.update(payload)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => DeleteScheduleMessageDto)
  async deleteGospel (@Args('id', { type: () => Int }) id: number) {
    return await this.gospelService.delete(id)
  }
}
