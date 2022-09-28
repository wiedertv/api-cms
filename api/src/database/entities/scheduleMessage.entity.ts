import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base.entity'

@ObjectType()
@Entity('ScheduleMessage')
export class ScheduleMessageEntity extends BaseEntity {
    @Field()
    @Column({ type: 'text' })
    passage:string

    @Field()
    @Column({ type: 'text' })
    description:string

    @Field()
    @Column({ type: 'text' })
    message:string;

    @Field(() => Boolean)
    @Column({ type: 'boolean' })
    released:boolean;

    @Field()
    @Column({ type: 'text' })
    releaseDate: string;
}
