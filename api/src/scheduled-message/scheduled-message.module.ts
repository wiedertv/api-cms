import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleMessageEntity } from '../database/entities/scheduleMessage.entity'
import { ScheduledMessageResolver } from './scheduled-message.resolver'
import { ScheduledMessageService } from './scheduled-message.service'

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleMessageEntity])],
  providers: [ScheduledMessageService, ScheduledMessageResolver],
  exports: [ScheduledMessageService]
})
export class ScheduledMessageModule {}
