import { HttpModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Permissions } from 'src/database/entities/permissions.entity'
import { ContentFeedEntity } from '../database/entities/content-feed.entity'
import { Upload } from '../DTO/scalars/upload.scalar'
import { PermissionsService } from '../permissions/permissions.service'
import { S3Service } from '../s3/s3.service'
import { ContentFeedResolver } from './content-feed.resolver'
import { ContentFeedService } from './content-feed.service'

@Module({
  imports: [TypeOrmModule.forFeature([ContentFeedEntity, Permissions]), HttpModule],
  providers: [ContentFeedService, ContentFeedResolver, Upload, S3Service, PermissionsService],
  exports: [ContentFeedService]
})
export class ContentFeedModule {}
