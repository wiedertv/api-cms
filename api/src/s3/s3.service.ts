import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3 } from 'aws-sdk'
import { promisify } from 'util'

@Injectable()
export class S3Service {
  private readonly s3Bucket: string;
  private readonly upload;
  private readonly deleteObject;
  private readonly getObject;

  constructor (private readonly config: ConfigService) {
    const s3 = new S3({
      region: this.config.get<string>('s3.region'),
      secretAccessKey: this.config.get<string>('s3.secret_key'),
      accessKeyId: this.config.get<string>('s3.public_key')
    })
    s3.config.logger = console
    this.s3Bucket = this.config.get<string>('s3.bucket')
    this.upload = promisify(s3.upload).bind(s3)
    this.deleteObject = promisify(s3.deleteObject).bind(s3)
    this.getObject = promisify(s3.getObject).bind(s3)
  }

  async uploadFile (file: any): Promise<string> | never {
    try {
      const { filename, mimetype, createReadStream } = await file
      const buffer = []
      const stream = createReadStream()
      const bufferPromise = await new Promise((resolve) => {
        stream.on('data', (data) => {
          buffer.push(data)
        })
        stream.on('end', () => {
          resolve(Buffer.concat(buffer))
        })
      })
      const { Location } = await this.upload({
        Bucket: this.s3Bucket,
        Key: `${Date.now()}-${filename}`,
        Body: bufferPromise,
        ACL: 'public-read',
        ContentType: mimetype
      })
      return Location
    } catch (err) {
      throw new ConflictException({ code: 'S3_ERROR', message: err })
    }
  }

  async uploadFiles (files: any[]): Promise<string[]> | never {
    const uploads = []
    for (const file of files) {
      uploads.push(this.uploadFile(file))
    }
    return await Promise.all(uploads)
  }

  async deleteFile (url: string): Promise<{ success: boolean }> | never {
    const Key = url.split('/').pop()
    try {
      await this.deleteObject({
        Bucket: this.s3Bucket,
        Key
      })
      return { success: true }
    } catch (err) {
      throw new InternalServerErrorException({ code: 'S3_ERROR' })
    }
  }

  async getFile (url) {
    const Key = url.split('/').pop()
    try {
      return await this.getObject({
        Bucket: this.s3Bucket,
        Key
      })
    } catch (e) {
      throw new InternalServerErrorException({ code: 'S3_ERROR' })
    }
  }

  async uploadCsvFile (buffer) {
    try {
      const { Location } = await this.upload({
        Bucket: this.s3Bucket,
        Key: `${Date.now()}-csv`,
        Body: buffer,
        ACL: 'public-read',
        ContentType: 'text/csv'
      })
      return Location
    } catch (e) {
      throw new BadRequestException(e)
    }
  }
}
