import { EntityRepository, Repository } from 'typeorm'
import { Backup } from '../entities/backup.entity'

@EntityRepository(Backup)
export class BackupRepository extends Repository<Backup> { }
