import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base.entity'

@ObjectType()
@Entity({ name: 'Hall' })
export class Hall extends BaseEntity {
    @Field(() => String)
    @Column({ type: 'text' })
    member: string

    @Field(() => String)
    @Column({ type: 'text' })
    date: string

    @Field(() => String)
    @Column({ type: 'text' })
    hour: string

    @Field(() => String)
    @Column({ type: 'text' })
    activity: string
}
