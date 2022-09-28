import { EntityRepository, Repository } from 'typeorm'
import { ContentFeedEntity } from '../entities/content-feed.entity'

@EntityRepository(ContentFeedEntity)
export class ContentFeedRepository extends Repository<ContentFeedEntity> {}
