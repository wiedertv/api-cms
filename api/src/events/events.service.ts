import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EventsEntity } from '../database/entities/events.entity'
import { LocationsEntity } from '../database/entities/locations.entity'
import { EventsRepository } from '../database/repositories/events.repository'
import { LocationsRepository } from '../database/repositories/locations.repository'
import { RoleEnum } from '../DTO/enums/role.enum'
import { EventsDto, EventsInputDto } from '../DTO/events/events.dto'
import { UpdateEventsDto } from '../DTO/events/updateEvents.dto'
import { parsePermissions } from '../permissions/permissions.utils'
import { S3Service } from '../s3/s3.service'
import * as moment from 'moment-timezone'
import { FormatterOptionsArgs, writeToBuffer } from 'fast-csv'
import { DownloadDataDto, DownloadTableDto } from '../DTO/members/downloadTableDto'
@Injectable()
export class EventsService {
  constructor (
    @InjectRepository(EventsEntity)
    private readonly eventsRepository: EventsRepository,
    private readonly s3Service: S3Service,
    @InjectRepository(LocationsEntity)
    private readonly locationsRepository: LocationsRepository
  ) {}

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

   async getAll (offset, limit, order, filter, user, key?) {
     const totalCount = await this.eventsRepository.count()
     const direction = key && key !== 'empty' ? (key.slice(0, 1) === '+' ? 'DESC' : 'ASC') : null
     const columnKey = key && key !== 'empty' ? key.slice(1) : null
     let query = this.eventsRepository
       .createQueryBuilder('event')
       .orderBy(`event.${columnKey || order[0]}`, direction || order[1])
       .offset(offset)
       .limit(limit)
       .innerJoinAndSelect('event.location', 'location')

     if (filter.length) query = query.where('delegation @> :delegation', { delegation: [filter] })
     let data = await query.getMany()
     if (filter) data = data.filter((v) => v.delegation.includes(filter))
     if (user !== RoleEnum.Admin) data = await parsePermissions(data, user)
     return {
       count: totalCount || 0,
       offset,
       limit,
       order,
       key: key || '',
       data
     }
   }

   async getOne (id: number) {
     return await this.eventsRepository.findOne(id, { relations: ['location'] })
   }

   async create (payload: EventsInputDto) {
     try {
       if (payload.image != null) {
         const { filename } = await payload.image
         payload.imageName = filename
         payload.image = await this.s3Service.uploadFile(payload.image)
       } else {
         payload.imageName = 'Imagen de prueba'
         payload.image = 'https://picsum.photos/seed/picsum/200/300'
       }

       payload.location = await this.locationsRepository.save({ ...payload.location })
       payload.releaseDate = payload.releaseDate ? payload.releaseDate : new Date().toISOString().slice(0, 10)
       const ACTUAL_DATE = new Date().toISOString().slice(0, 10)
       if (moment.tz(payload.releaseDate, 'Europe/Madrid').format('YYYY-MM-DD') ===
                moment().tz('Europe/Madrid').format('YYYY-MM-DD') &&
                Number(moment.tz(ACTUAL_DATE, 'Europe/Madrid').format('h')) >= 6) {
         payload.released = true
       }
       return await this.eventsRepository.save({ ...payload })
     } catch (e) {
       throw new InternalServerErrorException({ code: '[CREATE_EVENT]', message: `${e}` })
     }
   }

   async update ({ id, ...payload }: UpdateEventsDto) {
     try {
       const event = await this.eventsRepository.findOne(id, { relations: ['location'] })
       const location = await this.locationsRepository.findOne(event.location.id)
       if (payload.location !== location) {
         payload.location = await this.locationsRepository.save({ ...location, ...payload.location })
       }
       if (payload.image && payload.image !== event.image) {
         const { filename } = await payload.image
         payload.imageName = filename
         payload.image = await this.s3Service.uploadFile(payload.image)
       }

       if (payload.releaseDate !== event.releaseDate) {
         payload.released = false
       }

       return await this.eventsRepository.save({ ...event, ...payload })
     } catch (e) {
       throw new InternalServerErrorException({ code: '[CREATE_EVENT]', message: `${e}` })
     }
   }

   async delete (id) {
     const e = await this.eventsRepository.findOne(id)
     await this.s3Service.deleteFile(e.image)
     await this.eventsRepository.delete(id)
     return { id }
   }

   async getToday () {
     const date = moment().tz('Europe/Madrid').format('YYYY-MM-DD')
     return await this.eventsRepository.query(`SELECT * from "Events" WHERE "releaseDate" LIKE '%${date}%'`)
   }

   async getFutureEvent (): Promise<EventsDto[]> {
     let data = await this.eventsRepository.createQueryBuilder()
       .where('released = :released', {
         released: false
       }).getMany()
     const today = await this.getToday()
     if (today) {
       data = data.concat(today)
     }
     return data
   }

   async downloadEvents ({ data, all }: DownloadDataDto):Promise<DownloadTableDto> {
     let events
     if (all) {
       events = await this.eventsRepository.find()
     } else {
       events = await this.eventsRepository.createQueryBuilder('event').where('event.id in (:...ids)', { ids: data }).getMany()
     }
     const buffer = await writeToBuffer(events, this.csvDefaultOptions)
     return {
       data: buffer.toString('base64'),
       filename: 'events.csv'
     }
   }
}
