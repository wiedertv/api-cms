import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { RoleEnum } from '../../DTO/enums/role.enum'
import { BaseEntity } from '../base.entity'

@ObjectType()
@Entity({ name: 'Users' })
export class Users extends BaseEntity {
  @Field()
  @Column({ type: 'text', unique: true })
  email: string;

  @Field(() => String)
  @Column({ type: 'text', default: '' })
  readonly name: string;

  @Field(() => String)
  @Column({ type: 'text', default: '' })
  readonly lastName: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column()
  role: RoleEnum;
}
