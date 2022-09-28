import {Field, InputType, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class DownloadTableDto {
  @Field(() => String)
  data: string;
  @Field(() => String)
  filename: string;
}

@InputType()
export class DownloadDataDto {
  @Field(()=> [String],{nullable: true})
  data: string[];
  @Field(()=>Boolean,{nullable: true})
  all: boolean;
}
