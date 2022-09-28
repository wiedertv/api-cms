import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as sgMail from '@sendgrid/mail'
import * as ejs from 'ejs'
import { promisify } from 'util'
import { ISendMail, ISendMailResponse } from '../DTO/mailer/mailer.dto'

@Injectable()
export class MailerService {
  constructor (private readonly configService: ConfigService) {
    this.sendgridKey = this.configService.get('sendgrid.key')
    this.mailerFrom = this.configService.get('sendgrid.from')
    this.webUrl = this.configService.get('uri')
    this.bannerButton = this.configService.get('BannerButton')
    this.mailto = this.configService.get('mailto')
    sgMail.setApiKey(this.sendgridKey)
  }

  private readonly sendgridKey;
  private readonly mailerFrom;
  private readonly webUrl;
  private readonly bannerButton;
  private readonly mailto;
  async sendMail ({ email, subject, body }: ISendMail, template: string): Promise<ISendMailResponse> {
    const context = {
      subject,
      email,
      body,
      link: `${this.webUrl}/`,
      bannerButton: template === 'appointment' ? this.bannerButton : null,
      mailto: template === 'appointment' ? this.mailto : null
    }
    try {
      const html = await promisify(ejs.renderFile)(`templates/${template}.template.ejs`, context)
      await sgMail.send({
        to: email,
        from: this.mailerFrom,
        subject,
        html
      })
      return { message: '[SEND_MAIL]: success' }
    } catch (err) {
      throw new InternalServerErrorException({
        code: 'MAILER_ERROR',
        error: err
      })
    }
  }

  async sendSuggestion ({ email, subject, body }, template, file) {
    const { name, data } = file
    const context = {
      subject,
      email,
      body,
      link: this.webUrl
    }
    try {
      const html = await promisify(ejs.renderFile)(`templates/${template}.template.ejs`, context)
      await sgMail.send({
        to: email,
        from: this.mailerFrom,
        subject,
        html,
        attachments: [
          {
            content: data,
            filename: name,
            disposition: 'attachment'
          }
        ]
      })
      return { message: '[SEND_SUGGESTION]: success' }
    } catch (err) {
      throw new InternalServerErrorException({
        code: 'MAILER_ERROR',
        error: err
      })
    }
  }
}
