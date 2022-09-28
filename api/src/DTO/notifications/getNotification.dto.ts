import { Members } from 'src/database/entities/members.entity';

import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetNotificationResponseDto {
    @Field()
    count: number;
    @Field()
    offset: number;
    @Field()
    limit: number;
    @Field(() => [NotificationDto])
    data: NotificationDto[]
}


@ObjectType()
export class NotificationDto {
    @Field(() => Int)
    id: number;
    @Field(() => Date)
    readonly createdAt?: Date;
    @Field(() => Date)
    readonly updatedAt?: Date;
    @Field()
    title: string;
    @Field()
    description: string;
    @Field()
    read: boolean;
    @Field()
    link: string;
    @Field(() => Members)
    member: Members;
}

@ObjectType()
export class CustomNotificationResponseDto {
    @Field()
    message: string;
}