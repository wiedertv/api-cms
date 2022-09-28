import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailerSettingsEntity } from '../database/entities/mailer-settings.entity'
import { Upload } from '../DTO/scalars/upload.scalar'
import { MailerService } from '../mailer/mailer.service'
import { S3Service } from '../s3/s3.service'
import { MailerSettingsResolver } from './mailer-settings.resolver'
import { MailerSettingsService } from './mailer-settings.service'

@Module({
  imports: [TypeOrmModule.forFeature([MailerSettingsEntity])],
  providers: [MailerSettingsService, MailerSettingsResolver, MailerService, S3Service, Upload]
})
export class MailerSettingsModule {}
