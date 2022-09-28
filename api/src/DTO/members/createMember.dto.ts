import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsAlphanumeric, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from 'class-validator'
import { DelegationEnum } from '../enums/delegation.enum'
import { IdentifierTypeEnum } from '../enums/identifier-type.enum'
import { RoleEnum } from '../enums/role.enum'
import { ILocation } from '../events/events.dto'

@InputType()
export class RegisterAppDto {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @Field(() => String)
  lastName: string;

  @IsNotEmpty()
  @Length(8, 16)
  @IsAlphanumeric()
  @Field()
  password: string;

  @IsOptional()
  @Field(() => RoleEnum, { defaultValue: RoleEnum.contactoInteres })
  role: RoleEnum;

  @IsNotEmpty()
  @Field()
  identifier: string;

  @IsNotEmpty()
  @Field(() => IdentifierTypeEnum)
  identifierType: IdentifierTypeEnum;

  @IsOptional()
  @Field({ nullable: true })
  location: ILocation;

  @Field({ nullable: true })
  @IsOptional()
  customID: string;

  @IsOptional()
  @Field(() => String, { defaultValue: '-' })
  delegation: string;
}

export class CreateMemberFromSugarDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ enum: RoleEnum })
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({ enum: IdentifierTypeEnum })
  @IsNotEmpty()
  @IsEnum(IdentifierTypeEnum)
  identifierType: IdentifierTypeEnum;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  location: ILocation;

  @ApiProperty({ enum: DelegationEnum })
  @IsNotEmpty()
  @IsEnum(DelegationEnum)
  delegation: DelegationEnum;
}
