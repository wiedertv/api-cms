import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base.entity'

@Entity('Magazine')
@ObjectType()
export class MagazineEntity extends BaseEntity {
    @Field()
    @Column({ type: 'text' })
    name: string;

    @Field()
    @Column({ type: 'text' })
    description: string;

    @Field()
    @Column({ type: 'text' })
    category: string;

    @Field()
    @Column({ type: 'text' })
    pdf: string;

    @Field(() => [String])
    @Column('text', { array: true })
    allowed: string[];

    @Field(() => String)
    @Column({ type: 'text' })
    pdfName: string;
}
