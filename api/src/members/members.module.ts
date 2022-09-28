import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { Backup } from '../database/entities/backup.entity'
import { LocationsBackup } from '../database/entities/locationBackup.entity'
import { LocationsEntity } from '../database/entities/locations.entity'
import { Members } from '../database/entities/members.entity'
import { MailerService } from '../mailer/mailer.service'
import { MembersController } from './members.controller'
import { MembersResolver } from './members.resolver'
import { MembersService } from './members.service'
import { Hall } from '../database/entities/hall.entity'
import { HallService } from '../hall/hall.service'

@Module({
  controllers: [MembersController],
  exports: [MembersService],
  imports: [TypeOrmModule.forFeature([Members, LocationsEntity, Backup, LocationsBackup, Hall]), forwardRef(() => AuthModule)],
  providers: [MembersService, HallService, MembersResolver, MailerService]
})
export class MembersModule {}
