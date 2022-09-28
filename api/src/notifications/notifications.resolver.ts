import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSubEngine } from 'graphql-subscriptions'
import { User as CurrentUser } from 'src/decorators/user.decorator'
import { AdminInterceptor } from '../auth/auth.interceptor'
import { GqlAuthGuard } from '../auth/graphql-auth.guard'
import { CreateNotificationDto } from '../DTO/notifications/createNotification.dto'
import { CustomNotificationResponseDto, NotificationDto } from '../DTO/notifications/getNotification.dto'
import { NotificationsService } from './notifications.service'

@Resolver('Notifications')
export class NotificationsResolver {
  constructor (private readonly notificationsService: NotificationsService, @Inject('PUB_SUB') private pubSub: PubSubEngine) {}

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => CustomNotificationResponseDto)
  async createCustomNotification (@Args('payload', { type: () => CreateNotificationDto }) payload: CreateNotificationDto) {
    return await this.notificationsService.create(payload)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [NotificationDto])
  async getUserNotifications (@CurrentUser() currentMember) {
    return this.notificationsService.getNotifications(currentMember.id)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [NotificationDto])
  async readNotifications (@CurrentUser() member) {
    return this.notificationsService.read(member.id)
  }

  @Subscription(() => CustomNotificationResponseDto, {
    filter: (payload, variables) => {
      return payload.notificationadded.member.id === variables.member
    },
    resolve () {
      return { message: 'notificationadded' }
    }
  })
  notificationAdded (@Args('member', { type: () => Int }) member: number) {
    return this.pubSub.asyncIterator('notificationadded')
  }
}
