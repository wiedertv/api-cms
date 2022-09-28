import { HttpModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MagazineEntity } from '../database/entities/magazine.entity'
import { Permissions } from '../database/entities/permissions.entity'
import { Upload } from '../DTO/scalars/upload.scalar'
import { PermissionsService } from '../permissions/permissions.service'
import { S3Service } from '../s3/s3.service'
import { MagazineResolver } from './magazine.resolver'
import { MagazineService } from './magazine.service'

@Module({
  imports: [TypeOrmModule.forFeature([MagazineEntity, Permissions]), HttpModule],
  providers: [MagazineService, MagazineResolver, S3Service, PermissionsService, Upload]
})
export class MagazineModule { }
