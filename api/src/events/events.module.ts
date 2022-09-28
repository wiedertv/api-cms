import { HttpModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventsEntity } from '../database/entities/events.entity'
import { LocationsEntity } from '../database/entities/locations.entity'
import { EventsResolver } from './events.resolver'
import { EventsService } from './events.service'

import { Permissions } from '../database/entities/permissions.entity'
import { Upload } from '../DTO/scalars/upload.scalar'
import { PermissionsService } from '../permissions/permissions.service'
import { S3Service } from '../s3/s3.service'

@Module({
  imports: [TypeOrmModule.forFeature([EventsEntity, Permissions, LocationsEntity]), HttpModule],
  providers: [EventsService, EventsResolver, Upload, PermissionsService, S3Service],
  exports: [EventsService]
})
export class EventsModule {}
