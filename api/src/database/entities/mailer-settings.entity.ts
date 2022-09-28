import { Field, ObjectType } from '@nestjs/graphql'
import { MailerSettingsEnum } from 'src/DTO/enums/mailer-settings.enum'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base.entity'

@Entity('MailerSettings')
@ObjectType()
export class MailerSettingsEntity extends BaseEntity {
    @Field(() => MailerSettingsEnum)
    @Column({ nullable: false, type: 'text', enum: MailerSettingsEnum, unique: true })
    name: string;

    @Field(() => String)
    @Column({ nullable: false, type: 'text' })
    email: string;
}
