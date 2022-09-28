import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'
import { UsersDto } from '../../DTO/users/users.dto'
import { Users } from '../entities/users.entity'

@Injectable()
@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<Users> {
  private readonly salt: string;
  constructor (private readonly configService: ConfigService, private connection: Connection) {
    connection.subscribers.push(this)
    this.salt = this.configService.get('auth.salt')
  }

  listenTo () {
    return Users
  }

  async beforeInsert (event: InsertEvent<UsersDto>) {
    event.entity.email = event.entity.email.toLowerCase().trim()
    this.hashPassword(event)
  }

  async beforeUpdate (event: UpdateEvent<UsersDto>) {
    this.hashPassword(event)
  }

  hashPassword (event) {
    if (event.entity && event.entity.password) {
      event.entity.password = bcrypt.hashSync(event.entity.password, this.salt)
    }
  }
}
