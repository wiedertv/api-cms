import { EntityRepository, Repository } from 'typeorm'
import { LocationsEntity } from '../entities/locations.entity'

@EntityRepository(LocationsEntity)
export class LocationsRepository extends Repository<LocationsEntity> { }
