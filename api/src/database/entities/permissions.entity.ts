import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { PermissionsEnum } from '../../DTO/enums/permissions.enum';
import { IAllowed } from '../../DTO/permissions/permissions.dto';
import { BaseEntity } from '../base.entity';

@ObjectType()
@Entity({ name: 'Permissions' })
export class Permissions extends BaseEntity {
  @Column({ unique: true, type: 'text', enum: PermissionsEnum })
  @Field(() => PermissionsEnum)
  name: string;

  @Field(() => IAllowed)
  @Column({ type: 'json' })
  allowed: IAllowed;
}
