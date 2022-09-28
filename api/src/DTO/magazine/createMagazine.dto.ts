import { Field, InputType } from '@nestjs/graphql'
import { Upload } from '../scalars/upload.scalar'

@InputType()
export class MagazineInputDto {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  category: string;

  @Field(() => Upload)
  pdf: any;

  @Field(() => [String])
  allowed: string[];

  @Field(() => String, { nullable: true })
  pdfName: string;
}
