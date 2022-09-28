import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator'
import { Members } from '../../database/entities/members.entity'

@ObjectType()
export class GetHallDto {
    @Field(() => Int)
    id: number;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field()
    member: Members;

    @Field()
    date: string;

    @Field()
    hour: string;

    @Field()
    activity: string;
}
@ObjectType()
export class GetAllHallDto {
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

  @Field(() => [GetHallDto])
  data: GetHallDto[];
}

@InputType()
export class FilterGetAllHallDto {
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

  @Field(() => String, { nullable: true })
  activity?:string;
}
