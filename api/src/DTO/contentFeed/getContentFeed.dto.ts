import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ContentFeedDto {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => [String])
  allowed: string[];

  @Field(() => [String])
  categories: string[];

  @Field(() => String)
  name: string;

  @Field(() => [String])
  delegations: string[];

  @Field(() => String)
  releaseDate: string;

  @Field()
  released: boolean;

  @Field(() => String)
  post: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  imageName: string;
}

@ObjectType()
export class GetAllContentFeedDto {
  @Field(() => Int)
  count: number;

  @Field(() => Int)
  offset: number;

  @Field(() => Int)
  limit: number;

  @Field(() => String, { nullable: true })
  key: string;

  @Field(() => [String])
  order: string[];

  @Field(() => [ContentFeedDto])
  data: ContentFeedDto[];
}
@InputType()
export class GetAllContentFeedInputDto {
  @Field(() => Int)
  offset: number;

  @Field(() => Int)
  limit: number;
}
