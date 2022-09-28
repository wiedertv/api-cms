import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base.entity'

@ObjectType()
@Entity('LocationsBackup')
export class LocationsBackup extends BaseEntity {
  @Field()
  @Column()
  userIdentifier: string;

  @Field()
  @Column({ type: 'text', default: '-' })
  street: string;

  @Field()
  @Column({ type: 'text', default: '-' })
  streetType: string;

  @Field()
  @Column({ type: 'text', default: '-' })
  country: string;

  @Field()
  @Column({ type: 'text', default: '-' })
  number: string;

  @Field()
  @Column({ type: 'text', default: '-' })
  flat: string;

  @Field()
  @Column({ type: 'text', default: '-' })
  zipCode: string;

  @Field()
  @Column({ type: 'text', default: '-' })
  province: string;

  @Field()
  @Column({ type: 'text', default: '-' })
  city: string;
}
