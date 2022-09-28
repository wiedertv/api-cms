import { Field, InputType, Int } from '@nestjs/graphql';
import { Upload } from '../scalars/upload.scalar';

@InputType()
export class UpdateMagazineInputDto {
  @Field(() => Int)
  id: number;
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  category: string;
  @Field(() => Upload, { nullable: true })
  pdf: any;
  @Field(() => [String], { nullable: true })
  allowed: string[];
  @Field(() => String, { nullable: true })
  pdfName: string;
}
