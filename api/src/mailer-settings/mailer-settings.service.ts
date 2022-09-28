import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MailerSettingsEntity } from 'src/database/entities/mailer-settings.entity'
import { MailerSettingsRepository } from '../database/repositories/mailer-settings.repository'
import { CreateAppointmentDto } from '../DTO/mailerSettings/createAppointment.dto'
import { MailerService } from '../mailer/mailer.service'
import { S3Service } from '../s3/s3.service'

@Injectable()
export class MailerSettingsService {
  constructor (
    @InjectRepository(MailerSettingsEntity)
    private readonly mailerSettingsRepository: MailerSettingsRepository,
    private readonly s3Service: S3Service,
    private readonly mailerService: MailerService
  ) {}

  async get () {
    return await this.mailerSettingsRepository.find()
  }

  async getByDelegation (delegation: string) {
    return await this.mailerSettingsRepository.findOne({ where: { name: delegation } })
  }

  async getOne (id: number) {
    return await this.mailerSettingsRepository.findOne(id)
  }

  async update (data) {
    for (const value of data) {
      const { name, email } = value
      try {
        const mailer = await this.mailerSettingsRepository.findOneOrFail({ where: { name } })
        await this.mailerSettingsRepository.save({ ...mailer, name, email })
      } catch (e) {
        throw new ConflictException({ code: '[UPDATE_PERMISSION_ERROR]', message: `Error updating the permissions data, ${e}` })
      }
    }
    return await this.get()
  }

  async sendSuggestion (payload, member) {
    try {
      const { name, lastName, email: memberEmail } = member
      const { email } = await this.getByDelegation('Sugerencias')
      return await this.mailerService.sendSuggestion(
        {
          email: [email, memberEmail],
          subject: 'Han enviado una sugerencia',
          body: { ...payload, name, lastName }
        },
        'suggestion',
        payload.image
      )
    } catch (e) {
      throw new InternalServerErrorException({ code: '[SEND_SUGGESTION]', message: e })
    }
  }

  async createAppointment (payload: CreateAppointmentDto) {
    try {
      if (payload.email) {
        await this.mailerService.sendMail(
          {
            email: payload.email,
            subject: 'Has solicitado una cita',
            body: payload
          },
          'appointment'
        )
      }
      const { email } = await this.getByDelegation(payload.delegation)
      await this.mailerService.sendMail(
        {
          email,
          subject: 'Un usuario solicitó una cita',
          body: payload
        },
        'appointment'
      )
      return {
        message: 'emails have been sent'
      }
    } catch (e) {
      throw new InternalServerErrorException({ code: '[CREATE_APPOINTMENT]', message: e })
    }
  }
}
