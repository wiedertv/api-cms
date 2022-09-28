import { Field, InputType } from '@nestjs/graphql';
import {IsEmail, IsNotEmpty, Matches} from 'class-validator';
import {RoleEnum} from '../enums/role.enum';

@InputType()
export class CreateUserDto {
  @Field()
  @Matches('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')
  @IsEmail({},{message:'this email is invalid'})
  readonly email: string;
  @Field({ nullable: true })
  readonly name?: string;
  @Field({ nullable: true })
  readonly lastName?: string;
  @Field()
  @IsNotEmpty()
  readonly password: string;
  @Field({ nullable: true })
  role?: RoleEnum;

}
