import { Injectable } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'
import { MembersService } from '../../members/members.service'
import { NotificationsService } from '../../notifications/notifications.service'
import { ContentFeedEntity } from '../entities/content-feed.entity'

@Injectable()
@EventSubscriber()
export class ContentFeedSubscriber implements EntitySubscriberInterface<ContentFeedEntity> {
  constructor (private connection: Connection,
        private readonly notificationsService: NotificationsService,
        private readonly membersService: MembersService) {
    connection.subscribers.push(this)
  }

  listenTo () {
    return ContentFeedEntity
  }

  async afterInsert (event: InsertEvent<ContentFeedEntity>) {
    if (event.entity.released) {
      const title = 'Nueva entrada'
      const description = 'Hemos publicado una nueva entrada'
      const members = await this.membersService.getWhere(event.entity.allowed)
      await this.notificationsService.sendNotificationFromSubscribers(title, description, members)
    }
  }

  async afterUpdate (event: UpdateEvent<ContentFeedEntity>) {
    if (event.entity && event.entity.released) {
      const title = 'Nueva entrada'
      const description = 'Hemos publicado una nueva entrada'
      const members = await this.membersService.getWhere(event.entity.allowed)
      await this.notificationsService.sendNotificationFromSubscribers(title, description, members)
    }
  }
}
