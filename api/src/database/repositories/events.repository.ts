import { EntityRepository, Repository } from 'typeorm'
import { EventsEntity } from '../entities/events.entity'

@EntityRepository(EventsEntity)
export class EventsRepository extends Repository<EventsEntity> {}
