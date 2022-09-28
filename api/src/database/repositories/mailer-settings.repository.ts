import { EntityRepository, Repository } from 'typeorm'
import { MailerSettingsEntity } from '../entities/mailer-settings.entity'

@EntityRepository(MailerSettingsEntity)
export class MailerSettingsRepository extends Repository<MailerSettingsEntity> {

}
