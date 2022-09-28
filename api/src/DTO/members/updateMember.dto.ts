import { Field, InputType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsAlphanumeric, IsEnum, IsNotEmpty, IsOptional, Length, Matches, ValidateNested } from 'class-validator'
import { DelegationEnum } from '../enums/delegation.enum'
import { IdentifierTypeEnum } from '../enums/identifier-type.enum'
import { RoleEnum } from '../enums/role.enum'
import { ILocation } from '../events/events.dto'

export class updateLocation {
  @ApiPropertyOptional()
  @IsOptional()
  street: string;

  @ApiPropertyOptional()
  @IsOptional()
  streetType: string;

  @ApiPropertyOptional()
  @IsOptional()
  zipCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  province: string;

  @ApiPropertyOptional()
  @IsOptional()
  country: string;

  @ApiPropertyOptional()
  @IsOptional()
  number: string;

  @ApiPropertyOptional()
  @IsOptional()
  flat: string;

  @ApiPropertyOptional()
  @IsOptional()
  city: string;
}

export class UpdateMemberFromControllerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  lastName?: string;

  @ApiPropertyOptional({ enum: RoleEnum })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  identifier?: string;

  @ApiPropertyOptional({ enum: IdentifierTypeEnum })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(IdentifierTypeEnum)
  identifierType?: IdentifierTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => updateLocation)
  location?: updateLocation;

  @ApiPropertyOptional({ enum: DelegationEnum })
  @IsOptional()
  @IsEnum(DelegationEnum)
  delegation: DelegationEnum;
}

@InputType()
export class UpdateMemberDto {
  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Length(8, 16)
  @IsAlphanumeric()
  @Field(() => String, { nullable: true })
  password?: string;

  @ApiPropertyOptional({ enum: RoleEnum })
  @IsOptional()
  @IsEnum(RoleEnum)
  @Field(() => RoleEnum, { nullable: true })
  role?: RoleEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  identifier?: string;

  @ApiPropertyOptional({ enum: IdentifierTypeEnum })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(IdentifierTypeEnum)
  @Field(() => IdentifierTypeEnum, { nullable: true })
  identifierType?: IdentifierTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @Field({ nullable: true })
  location?: ILocation;

  @ApiPropertyOptional({ enum: DelegationEnum })
  @IsOptional()
  @IsEnum(DelegationEnum)
  @Field({ nullable: true })
  delegation: DelegationEnum;
}
