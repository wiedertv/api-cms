import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../base.entity'
import { Members } from './members.entity'

@ObjectType()
@Entity('Notifications')
export class NotificationsEntity extends BaseEntity {
    @Column()
    @Field()
    title: string;

    @Column()
    @Field()
    description: string;

    @Column('boolean')
    @Field()
    read: boolean;

    @Column()
    @Field()
    link: string;

    @Field(() => Members)
    @ManyToOne(() => Members, (member) => member.notifications)
    @JoinColumn()
    member: Members;
}
