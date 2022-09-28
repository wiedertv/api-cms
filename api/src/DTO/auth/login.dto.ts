import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UsersDto } from '../users/users.dto';
import {Members} from "../../database/entities/members.entity";

@InputType()
export class LoginInputDto {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginDto {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginResponseDto {
  @Field()
  user: UsersDto;
  @Field()
  token: string;
  @Field()
  message: string;
}

@InputType()
export class LoginAppDto {
  @Field()
  username: string;
  @Field()
  password: string;
}
@ObjectType()
export class LoginAppResponseDto {
  @Field()
  member: Members;
  @Field()
  token: string;
  @Field()
  message: string;
}