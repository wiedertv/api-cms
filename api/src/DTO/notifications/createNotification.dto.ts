import { Field, InputType, Int } from '@nestjs/graphql';
import { RegisterAppDto } from '../members/createMember.dto';

@InputType()
export class MembersInputDTO extends RegisterAppDto {
  @Field(() => Int, { nullable: true })
  id: number;
}

@InputType()
export class CreateNotificationDto {
  @Field()
  title: string;
  @Field()
  description: string;
  @Field()
  read: boolean;
  @Field()
  link: string;
  @Field(() => MembersInputDTO, { nullable: true })
  member: MembersInputDTO;
}
