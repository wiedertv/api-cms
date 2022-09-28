import { EntityRepository, Repository } from 'typeorm'
import { ScheduleMessageEntity } from '../entities/scheduleMessage.entity'

@EntityRepository(ScheduleMessageEntity)
export class ScheduleMessageRepository extends Repository<ScheduleMessageEntity> {}
