import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ContentFeedEntity } from '../database/entities/content-feed.entity'
import { ContentFeedRepository } from '../database/repositories/content-feed.repository'
import { DeleteContentFeedDto } from '../DTO/contentFeed/deleteContentFeed.dto'
import { ContentFeedDto, GetAllContentFeedDto } from '../DTO/contentFeed/getContentFeed.dto'
import { UpdateContentFeedDto } from '../DTO/contentFeed/updateContentFeed.dto'
import { RoleEnum } from '../DTO/enums/role.enum'
import { parsePermissions } from '../permissions/permissions.utils'
import { S3Service } from '../s3/s3.service'
import { DownloadDataDto, DownloadTableDto } from '../DTO/members/downloadTableDto'
import { FormatterOptionsArgs, writeToBuffer } from 'fast-csv'
import * as moment from 'moment-timezone'
import { CreateContentFeedDto } from '../DTO/contentFeed/createContentFeed.dto'

@Injectable()
export class ContentFeedService {
  constructor (@InjectRepository(ContentFeedEntity)
    private readonly contentFeedRepository: ContentFeedRepository,
        private readonly s3Service: S3Service) {
  }

    private readonly csvDefaultOptions: FormatterOptionsArgs<any, any> = {
      delimiter: ',',
      headers: true,
      writeHeaders: true,
      writeBOM: true,
      includeEndRowDelimiter: true,
      rowDelimiter: '\r\n',
      quoteColumns: true,
      quoteHeaders: false
    };

    async getAll (offset, limit, order, filter, user, key?): Promise<GetAllContentFeedDto> {
      const totalCount = await this.contentFeedRepository.count()
      const direction = key && key !== 'empty' ? key.slice(0, 1) === '+' ? 'DESC' : 'ASC' : null
      const columnKey = key && key !== 'empty' ? key.slice(1) : null
      let query = this.contentFeedRepository.createQueryBuilder('entries')
        .orderBy(`entries.${columnKey || order[0]}`, direction || order[1])
        .offset(offset)
        .limit(limit)
      if (filter.length && filter[0] === 'delegations') query = query.where('delegations @> :delegation', { delegation: [filter[1]] })
      if (filter.length && filter[0] === 'categories') query = query.where('categories @> :categories', { categories: [filter[1]] })
      let data = await query.getMany()
      if (user !== RoleEnum.Admin) data = await parsePermissions(data, user)
      return {
        count: totalCount,
        offset,
        limit,
        order,
        key,
        data
      }
    }

    async getOne (id: number): Promise<ContentFeedDto> {
      return await this.contentFeedRepository.findOne(id)
    }

    async create (payload: CreateContentFeedDto): Promise<ContentFeedDto> {
      try {
        const { filename } = await payload.image
        const releaseDate = payload.releaseDate ? payload.releaseDate : new Date().toISOString().slice(0, 10)
        if (payload.releaseDate == null) payload.releaseDate = releaseDate
        const ACTUAL_DATE = new Date().toISOString().slice(0, 10)
        payload.imageName = filename
        payload.image = await this.s3Service.uploadFile(payload.image)
        if (moment.tz(releaseDate, 'Europe/Madrid').format('YYYY-MM-DD') ===
                moment().tz('Europe/Madrid').format('YYYY-MM-DD') &&
                Number(moment.tz(ACTUAL_DATE, 'Europe/Madrid').format('h')) >= 6) {
          payload.released = true
        }
        return await this.contentFeedRepository.save({ ...payload })
      } catch (e) {
        throw new InternalServerErrorException({ code: '[CREATE_EVENT]', message: `${e}` })
      }
    }

    async update ({ id, ...payload }: UpdateContentFeedDto): Promise<ContentFeedDto> {
      try {
        const content = await this.contentFeedRepository.findOne(id)
        if (payload.image && payload.image !== content.image) {
          const { filename } = await payload.image
          payload.imageName = filename
          payload.image = await this.s3Service.uploadFile(payload.image)
        }
        const CURRENT_DATE = moment.tz(new Date(), 'Europe/Madrid').format('YYYY-MM-DD')
        if (payload.releaseDate !== content.releaseDate || moment.tz(payload.releaseDate, 'Europe/Madrid').format('YYYY-MM-DD') > CURRENT_DATE) {
          payload.released = false
        }
        return await this.contentFeedRepository.save({ ...content, ...payload })
      } catch (e) {
        throw new BadRequestException()
      }
    }

    async delete (id: number): Promise<DeleteContentFeedDto> {
      await this.contentFeedRepository.delete(id)
      return { id }
    }

    async downloadEntries ({ data, all }: DownloadDataDto):Promise<DownloadTableDto> {
      let entries
      if (all) {
        entries = await this.contentFeedRepository.find()
      } else {
        entries = await this.contentFeedRepository.createQueryBuilder('entries').where('entries.id in (:...ids)', { ids: data }).getMany()
      }
      const values = entries.map((v) => {
        v.post = v.post.replace(/<.*?>/g, '')
        return v
      })
      const buffer = await writeToBuffer(values, this.csvDefaultOptions)
      return {
        data: buffer.toString('base64'),
        filename: 'entries.csv'
      }
    }

    async getToday () {
      const date = moment().tz('Europe/Madrid').format('YYYY-MM-DD')
      return await this.contentFeedRepository.query(`SELECT * from "ContentFeed" WHERE "releaseDate" LIKE '%${date}%'`)
    }

    async getFutureEntries (): Promise<ContentFeedDto[]> {
      let data = await this.contentFeedRepository.createQueryBuilder()
        .where('released = :released', {
          released: false
        }).getMany()
      const today = await this.getToday()
      if (today) {
        data = data.concat(today)
      }
      return data
    }
}
