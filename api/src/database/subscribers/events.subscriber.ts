import { Injectable } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'
import { EventsDto } from '../../DTO/events/events.dto'
import { MembersService } from '../../members/members.service'
import { NotificationsService } from '../../notifications/notifications.service'
import { EventsEntity } from '../entities/events.entity'

@Injectable()
@EventSubscriber()
export class EventsSubscriber implements EntitySubscriberInterface<EventsEntity> {
  constructor (private connection: Connection,
        private readonly notificationsService: NotificationsService,
        private readonly membersService: MembersService) {
    connection.subscribers.push(this)
  }

  listenTo () {
    return EventsEntity
  }

  async afterInsert (event: InsertEvent<EventsDto>) {
    if (event.entity.released) {
      const title = 'Nuevo Evento'
      const description = 'Hemos publicado un nuevo evento'
      const members = await this.membersService.getWhere(event.entity.allowed)
      await this.notificationsService.sendNotificationFromSubscribers(title, description, members)
    }
  }

  async afterUpdate (event: UpdateEvent<EventsDto>) {
    if (event.entity && event.entity.released) {
      const title = 'Nuevo evento'
      const description = 'Hemos publicado un nuevo evento'
      const members = await this.membersService.getWhere(event.entity.allowed)
      await this.notificationsService.sendNotificationFromSubscribers(title, description, members)
    }
  }
}
