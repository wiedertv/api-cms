import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class getActivitiesDto {
    @Field(() => [String])
    data: string[];
}
