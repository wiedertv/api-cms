import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MagazineDto {
  @Field(() => Int)
  id: number;
  @Field(() => Date)
  createdAt: Date;
  @Field()
  name: string;
  @Field()
  description: string;
  @Field()
  category: string;
  @Field()
  pdf: string;
  @Field(() => [String])
  allowed: string[];
  @Field(() => String)
  pdfName: string;
}

@ObjectType()
export class AllMagazineResponseDto {
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
  @Field(() => [MagazineDto])
  data: MagazineDto[];
}
