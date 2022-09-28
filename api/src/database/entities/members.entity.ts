import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import { IdentifierTypeEnum } from '../../DTO/enums/identifier-type.enum'
import { RoleEnum } from '../../DTO/enums/role.enum'
import { BaseEntity } from '../base.entity'
import { LocationsEntity } from './locations.entity'
import { NotificationsEntity } from './notifications.entity'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType()
@Entity({ name: 'Members' })
export class Members extends BaseEntity {
  @ApiProperty()
  @Field()
  @Column({ type: 'text', unique: true })
  email: string;

  @ApiProperty()
  @Field(() => String)
  @Column({ type: 'text' })
  name: string;

  @ApiProperty()
  @Field(() => String)
  @Column({ type: 'text' })
  lastName: string;

  @ApiProperty()
  @Field()
  @Column({ select: false })
  password: string;

  @ApiProperty()
  @Field()
  @Column({ default: false })
  isUpdated: boolean;

  @ApiProperty()
  @OneToOne(() => LocationsEntity, { cascade: ['update', 'remove'], nullable: true })
  @JoinColumn()
  location: LocationsEntity;

  @ApiProperty()
  @Field()
  @Column({ default: RoleEnum.contactoInteres, type: 'enum', enum: RoleEnum })
  role: RoleEnum;

  @ApiProperty()
  @Field()
  @Column({ type: 'text', unique: true })
  identifier: string;

  @ApiProperty()
  @Field()
  @Column({ type: 'text', default: '-' })
  delegation: string;

  @ApiProperty()
  @Field()
  @Column({ default: IdentifierTypeEnum.dniNif, type: 'enum', enum: IdentifierTypeEnum })
  identifierType: IdentifierTypeEnum;

  @ApiProperty()
  @Field()
  @Column({ default: false })
  confirmed: boolean;

  @ApiProperty()
  @Field()
  @Column({ type: 'text', nullable: true })
  customID: string;

  @ApiProperty()
  @OneToMany(() => NotificationsEntity, (notification) => notification.member)
  notifications: NotificationsEntity[];
}
