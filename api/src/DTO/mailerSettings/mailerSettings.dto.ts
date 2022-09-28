import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { MailerSettingsEnum } from 'src/DTO/enums/mailer-settings.enum';

@InputType()
export class MailerSettingsInputDto {
  @Field(() => Int, { nullable: true })
  id?: number;
  @Field(() => MailerSettingsEnum)
  name: string;
  @Field(() => String)
  email: string;
}

@ObjectType()
export class MailerSettingsDto {
  @Field(() => Int)
  id?: number;
  @Field(() => MailerSettingsEnum)
  name: string;
  @Field(() => String)
  email: string;
}
