import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class ImageDto {
  @Field()
  data: string;

  @Field()
  name: string;

  @Field()
  type: string;
}
@InputType()
export class CreateSuggestionDto {
  @Field()
  reason: string;

  @Field()
  comment: string;

  @Field(() => ImageDto)
  image: ImageDto;
}

@ObjectType()
export class CreateSuggestionResponseDto {
  @Field()
  message: string;
}
