import {Field, InputType, Int, ObjectType} from '@nestjs/graphql';

@InputType()
export class RegisterDto {
  @Field()
  email: string;
  @Field({nullable:true})
  body?: string;
  @Field({nullable:true})
  subject?: string;
  @Field({nullable:true})
  link?: string;
}

@ObjectType()
export class RegisterResponseDto {
  @Field()
  message: string;
  @Field()
  email:string;
  @Field(()=>Int)
  id:number;
}
