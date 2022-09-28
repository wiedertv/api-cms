import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class DeleteUserResponseDto{
    @Field()
    message:string;
    @Field()
    email:string;
    @Field()
    id: number;
}
