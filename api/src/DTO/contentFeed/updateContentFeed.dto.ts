import { Field, InputType, Int } from '@nestjs/graphql';
import { Upload } from '../scalars/upload.scalar';

@InputType()
export class UpdateContentFeedDto {
  @Field(() => Int)
  id: number;
  @Field(() => [String], { nullable: true })
  allowed: string[];
  @Field(() => [String], { nullable: true })
  categories: string[];
  @Field(() => String, { nullable: true })
  name: string;
  @Field(() => [String], { nullable: true })
  delegations: string[];
  @Field(() => Boolean, { nullable: true })
  scheduled: boolean;
  @Field(() => String, { nullable: true })
  releaseDate: string;
  @Field({ nullable: true })
  released:boolean;
  @Field(() => String, { nullable: true })
  post: string;
  @Field(() => Upload, { nullable: true })
  image: any;
  @Field(() => String, { nullable: true })
  imageName: string;
}
