import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { Members } from 'src/database/entities/members.entity'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'

@Injectable()
@EventSubscriber()
export class MembersSubscriber implements EntitySubscriberInterface<Members> {
    private readonly salt: string;
    constructor (private readonly configService: ConfigService, private connection: Connection) {
      connection.subscribers.push(this)
      this.salt = bcrypt.genSaltSync(this.configService.get('auth.salt'))
    }

    listenTo () {
      return Members
    }

    async beforeInsert (event: InsertEvent<Members>) {
      event.entity.email = event.entity.email.toLowerCase()
      this.hashPassword(event)
    }

    beforeUpdate (event: UpdateEvent<Members>): void {
      if (event.updatedColumns.find((up) => up.propertyName === 'password')) {
        return this.hashPassword(event)
      }
    }

    hashPassword (event) {
      if (event.entity && event.entity.password) {
        event.entity.password = bcrypt.hashSync(event.entity.password, this.salt)
      }
    }

  // async afterUpdate(event: UpdateEvent<Members>) { }

  // async afterInsert(event: InsertEvent<Members>) { }
}
