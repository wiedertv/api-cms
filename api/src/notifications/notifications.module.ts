import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from 'pg'
import { Permissions } from 'src/database/entities/permissions.entity'
import { NotificationsEntity } from '../database/entities/notifications.entity'
import { MembersModule } from '../members/members.module'
import { PermissionsService } from '../permissions/permissions.service'
import { NotificationsResolver } from './notifications.resolver'
import { NotificationsService } from './notifications.service'

import { PostgresPubSub } from 'graphql-postgres-subscriptions'

@Module({
  imports: [TypeOrmModule.forFeature([Permissions, NotificationsEntity]), MembersModule],
  providers: [
    NotificationsService,
    NotificationsResolver,
    PermissionsService,
    {
      provide: 'PUB_SUB',
      useFactory: async (configService: ConfigService) => {
        const { username: user, host, password, database } = configService.get('typeorm')
        const client = new Client({ user, host, password, database })
        await client.connect()
        return new PostgresPubSub({ client })
      },
      inject: [ConfigService]
    }
  ],
  exports: [NotificationsService, 'PUB_SUB']
})
export class NotificationsModule {}
