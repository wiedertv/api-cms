import { EntityRepository, Repository } from 'typeorm'
import { Members } from '../entities/members.entity'

@EntityRepository(Members)
export class MembersRepository extends Repository<Members> {

}
