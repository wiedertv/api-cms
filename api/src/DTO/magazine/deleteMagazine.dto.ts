import { Field, Int, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class DeleteMagazineDto {
    @Field(() => Int)
    id: number
}