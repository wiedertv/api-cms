import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base.entity'
import { IdentifierTypeEnum } from '../../DTO/enums/identifier-type.enum'

@ObjectType()
@Entity({ name: 'Backup' })
export class Backup extends BaseEntity {
  @Field()
  @Column()
  identifier: string;

  @Field()
  @Column({ default: IdentifierTypeEnum.dniNif, type: 'enum', enum: IdentifierTypeEnum })
  identifierType: IdentifierTypeEnum;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  role: string;

  @Field()
  @Column()
  delegation: string;

  @Field()
  @Column()
  customID: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email: string;
}
