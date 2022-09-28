import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class CreateAppointmentDto {
  @Field(() => String)
  reason: string;

  @Field(() => String)
  speciality: string;

  @Field(() => String)
  comment: string;

  @Field(() => String)
  delegation: string;

  @Field(() => Boolean)
  videocall: boolean;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => String, { nullable: true })
  email?: string;
}

@ObjectType()
export class CreateAppointmentResponseDto {
  @Field(() => String)
  message: string;
}
