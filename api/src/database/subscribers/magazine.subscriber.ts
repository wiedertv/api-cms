import { Injectable } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'
import { MagazineDto } from '../../DTO/magazine/getMagazine.dto'
import { MembersService } from '../../members/members.service'
import { NotificationsService } from '../../notifications/notifications.service'
import { MagazineEntity } from '../entities/magazine.entity'

@Injectable()
@EventSubscriber()
export class MagazineSubscriber implements EntitySubscriberInterface<MagazineEntity> {
  constructor (private connection: Connection,
        private readonly notificationsService: NotificationsService,
        private readonly membersService: MembersService) {
    connection.subscribers.push(this)
  }

  listenTo () {
    return MagazineEntity
  }

  async afterInsert (event: InsertEvent<MagazineDto>) {
    const promises = []
    const members = await this.membersService.getWhere(event.entity.allowed)
    for (const member of members) {
      promises.push(this.notificationsService.createAsyncNotification({
        title: 'Nueva noticia',
        description: 'Hemos publicado una nueva noticia',
        read: false,
        link: ' ',
        member
      }))
    }
    await Promise.all(promises)
  }
}
