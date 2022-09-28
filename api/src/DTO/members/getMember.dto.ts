import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'
import { Members } from '../../database/entities/members.entity'
import { DelegationEnum } from '../enums/delegation.enum'
import { IdentifierTypeEnum } from '../enums/identifier-type.enum'
import { RoleEnum } from '../enums/role.enum'
import { ILocation } from '../events/events.dto'

@ObjectType()
export class MemberWithQrDto extends Members {
  @Field()
  qr: string;
}

export class MemberFromController {
 @ApiProperty()
 id: string;

 @ApiProperty()
 name: string;

 @ApiProperty()
 lastName: string

 @ApiProperty({ enum: IdentifierTypeEnum })
 identifierType: IdentifierTypeEnum

 @ApiProperty({ enum: DelegationEnum })
 delegation: DelegationEnum

 @ApiProperty()
 identifier: string

 @ApiProperty({ enum: RoleEnum })
 role: RoleEnum

 @ApiProperty()
 customID: string

 @ApiProperty()
 email: string

 @ApiProperty()
 location: ILocation
}
@ObjectType()
export class MembersResponseDto {
  @Field()
  count: number;

  @Field()
  offset: number;

  @Field()
  limit: number;

  @Field(() => [String])
  order: string[];

  @Field(() => String)
  key: string;

  @Field(() => [Members])
  data: Members[];
}

@InputType()
export class FilterMemberDto {
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @Field(() => [DelegationEnum], { nullable: true })
  delegations?: DelegationEnum[];

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: true })
  isUpdated?: boolean;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @Field(() => [String], { nullable: true })
  roles?: string[];

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  startDate?: string;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  endDate?: string;
}
