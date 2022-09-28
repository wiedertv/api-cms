import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class DeleteContentFeedDto{
    @Field(()=>Int)
    id: number;
}
