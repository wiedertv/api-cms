import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@ObjectType()
export class ScheduleMessageDto {
  @Field(() => Int)
  readonly id?: number;
  @Field(() => Date)
  readonly createdAt?: Date;
  @Field(() => Date)
  readonly updatedAt?: Date;
  @Field()
  @MaxLength(60)
  passage: string;
  @Field()
  @MaxLength(60)
  description: string;
  @Field()
  message: string;
  @Field()
  released: boolean;
  @Field()
  releaseDate: string;
}

@ObjectType()
export class GospelResponseDto {
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
  @Field(() => [ScheduleMessageDto])
  data: ScheduleMessageDto[];
}

@InputType()
export class ScheduleMessageUpdateDto {
  @Field(() => Int)
  readonly id?: number;
  @Field({ nullable: true })
  @MaxLength(60)
  passage: string;
  @Field({ nullable: true })
  @MaxLength(60)
  description: string;
  @Field({ nullable: true })
  message: string;
  @Field({ nullable: true })
  released: boolean;
  @Field(() => String, { nullable: true })
  releaseDate: string;
}

@InputType()
export class ScheduleMessageInputDto {
  @Field()
  @MaxLength(60)
  passage?: string;
  @Field()
  @MaxLength(60)
  description?: string;
  @Field()
  message?: string;
  @Field({ nullable: true })
  released?: boolean;
  @Field()
  releaseDate?: string;
}

@ObjectType()
export class DeleteScheduleMessageDto {
  @Field()
  message: string;
  @Field(() => Int)
  id: number;
}
