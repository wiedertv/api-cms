import { Injectable } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'
import { MembersService } from '../../members/members.service'
import { NotificationsService } from '../../notifications/notifications.service'
import { ScheduleMessageEntity } from '../entities/scheduleMessage.entity'
@Injectable()
@EventSubscriber()
export class GospelSubscriber implements EntitySubscriberInterface<ScheduleMessageEntity> {
  constructor (
    private connection: Connection,
    private readonly notificationsService: NotificationsService,
    private readonly membersService: MembersService
  ) {
    connection.subscribers.push(this)
  }

  listenTo () {
    return ScheduleMessageEntity
  }

  async afterInsert (event: InsertEvent<ScheduleMessageEntity>) {
    if (event.entity.released) {
      const members = await this.membersService.setNotifications()
      const title = 'Nueva lectura'
      const description = 'Hemos publicado una nueva lectura'
      await this.notificationsService.sendNotificationFromSubscribers(title, description, members)
    }
  }

  async afterUpdate (event: UpdateEvent<ScheduleMessageEntity>) {
    if (event.entity && event.entity.released) {
      const members = await this.membersService.setNotifications()
      const title = 'Nueva lectura'
      const description = 'Hemos publicado una nueva lectura'
      await this.notificationsService.sendNotificationFromSubscribers(title, description, members)
    }
  }
}
