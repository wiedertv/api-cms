import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Permissions } from '../database/entities/permissions.entity'
import { PermissionsResolver } from './permissions.resolver'
import { PermissionsService } from './permissions.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Permissions])
  ],
  providers: [PermissionsService, PermissionsResolver],
  exports: [PermissionsService]
})
export class PermissionsModule {}
