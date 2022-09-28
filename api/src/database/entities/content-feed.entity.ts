import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base.entity'

@Entity('ContentFeed')
@ObjectType()
export class ContentFeedEntity extends BaseEntity {
    @Field(() => [String])
    @Column('text', { array: true })
    allowed: string[];

    @Field(() => [String])
    @Column('text', { array: true })
    categories: string[];

    @Field(() => String)
    @Column({ type: 'text' })
    name: string;

    @Field(() => String)
    @Column({ type: 'text' })
    image: string;

    @Field(() => String)
    @Column({ type: 'text' })
    imageName: string;

    @Field(() => [String])
    @Column('text', { array: true })
    delegations: string[];

    @Field(() => String)
    @Column({ type: 'text', default: new Date().toISOString().slice(0, 10) })
    releaseDate: string;

    @Column({ type: 'boolean', default: false })
    released: boolean;

    @Field(() => String)
    @Column({ type: 'text' })
    post: string;
}
