import { EntityRepository, Repository } from 'typeorm'
import { MagazineEntity } from '../entities/magazine.entity'

@EntityRepository(MagazineEntity)
export class MagazineRepository extends Repository<MagazineEntity> {}
