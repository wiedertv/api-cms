import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from '../base.entity'
import { LocationsEntity } from './locations.entity'

@ObjectType()
@Entity('Events')
export class EventsEntity extends BaseEntity {
  @Field(() => [String])
  @Column('text', { nullable: false, array: true })
  delegation: string[];

  @Field()
  @Column({ nullable: false, type: 'text' })
  startHour: string;

  @Field()
  @Column({ nullable: false, type: 'text' })
  endHour: string;

  @Column({ nullable: false, type: 'text' })
  startDate: string;

  @Field()
  @Column({ nullable: false, type: 'text' })
  endDate: string;

  @Field()
  @Column({ nullable: false, type: 'text' })
  image: string;

  @Field(() => String)
  @Column({ type: 'text' })
  imageName: string;

  @Field()
  @Column({ nullable: false, type: 'text' })
  name: string;

  @Field()
  @Column({ nullable: false, type: 'text' })
  description: string;

  @Field(() => [String])
  @Column('text', { array: true })
  allowed: string[];

  @Field()
  @Column({ nullable: true, type: 'float' })
  ticketPrice: number;

  @Field()
  @Column({ nullable: true, type: 'text' })
  buyTicketsLink: string;

  @Field()
  @Column({ type: 'text' })
  releaseDate: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  released: boolean;

  @Field()
  @OneToOne(() => LocationsEntity, { cascade: ['update', 'remove'] })
  @JoinColumn()
  location: LocationsEntity;
}
