import { Field, InputType } from '@nestjs/graphql'
import { Upload } from '../scalars/upload.scalar'

@InputType()
export class CreateContentFeedDto {
  @Field(() => [String])
  allowed: string[];

  @Field(() => [String])
  categories: string[];

  @Field(() => String)
  name: string;

  @Field(() => [String])
  delegations: string[];

  @Field(() => String, { nullable: true })
  releaseDate: string;

  @Field()
  released:boolean;

  @Field(() => String)
  post: string;

  @Field(() => Upload)
  image: any;

  @Field(() => String, { nullable: true })
  imageName: string;
}
