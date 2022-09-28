import { BadRequestException, Injectable } from '@nestjs/common'
import { Brackets, Repository } from 'typeorm'
import { Hall } from '../database/entities/hall.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Members } from '../database/entities/members.entity'
import { CreateHallDto } from '../DTO/hall/createHall.dto'
import { FilterGetAllHallDto } from '../DTO/hall/getHall.dto'
import * as moment from 'moment-timezone'
import { DownloadDataDto, DownloadTableDto } from '../DTO/members/downloadTableDto'
import { FormatterOptionsArgs, writeToBuffer } from 'fast-csv'
import { getActivitiesDto } from 'src/DTO/hall/getActivities.dto'

@Injectable()
export class HallService {
  constructor (
        @InjectRepository(Hall)
        private readonly hallRepository: Repository<Hall>,
        @InjectRepository(Members)
        private readonly membersRepository: Repository<Members>
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

   async create (payload:CreateHallDto) {
     try {
       const { serialNumber: customID, date, hour, activity } = payload
       const member = await this.membersRepository.findOne({ where: { customID } })
       if (!member) {
         throw new BadRequestException('[ADD HALL MEMBER] THIS SERIAL NUMBER IS INVALID')
       }

       const hall = {
         member: customID,
         date: moment(date, 'MM-DD-YYYY').tz('Europe/Madrid').format('MM-DD-YYYY'),
         hour,
         activity
       }
       return await this.hallRepository.save(
         { ...hall }
       )
     } catch (e) {
       throw new BadRequestException(e)
     }
   }

   async getAll (offset?, limit?, order?, key?, search?: string, filter?:FilterGetAllHallDto) {
     const direction = key && key !== 'empty' ? (key.slice(0, 1) === '+' ? 'DESC' : 'ASC') : null
     const columnKey = key && key !== 'empty' ? key.slice(1) : null
     const query = this.hallRepository.createQueryBuilder('hall')
       .orderBy(`hall.${columnKey || order[0]}`, direction || order[1])
       .offset(offset)
       .limit(limit)
       .innerJoinAndMapOne('hall.member', Members, 'member', 'member.customID = hall.member')
     if (filter) {
       query.where({})
       const { startDate, endDate, activity } = filter
       if (activity) query.andWhere('hall.activity = :activity', { activity })
       if (!!startDate && !!endDate) {
         query.andWhere(new Brackets((qb) => qb.where("TO_DATE(hall.date,'YYYY-MM-DD') BETWEEN :startDate AND :endDate", { startDate, endDate })))
       }
       if (!!startDate && !endDate) {
         query.andWhere("TO_DATE(hall.date,'YYYY-MM-DD') BETWEEN :startDate AND NOW()", { startDate })
       }
       if (!!endDate && !startDate) {
         const start = moment.utc('2020-01-01', 'YYYY-MM-DD').startOf('day').toISOString()
         query.andWhere("TO_DATE(hall.date,'YYYY-MM-DD') BETWEEN :start AND :endDate", { start, endDate })
       }
     }
     if (search) {
       query.andWhere(
         new Brackets((qb) =>
           qb.where(
             'LOWER(member.name) like :search OR LOWER(member.lastName) like :search',
             { search: `%${search.toLowerCase()}%` }
           )
         )
       )
     }
     const [data, totalCount] = await query.getManyAndCount()
     return {
       count: totalCount || 0,
       offset,
       limit,
       order,
       key: key || '',
       data
     }
   }

   async downloadDataHalls ({ data, all }: DownloadDataDto):Promise<DownloadTableDto> {
     let members
     const query = this.hallRepository.createQueryBuilder('hall')
       .select(['hall.id', 'hall.member', 'hall.activity', 'hall.date', 'hall.hour'])
       .innerJoinAndMapOne('hall.member', Members, 'member', 'member.customID = hall.member')
     if (all) {
       members = await query.getMany()
     } else {
       members = await query.where('hall.id in (:...ids)', { ids: data }).getMany()
     }
     members = members.map(v => {
       v.member_name = v.member.name
       v.member_lastName = v.member.lastName
       v.member_email = v.member.email
       v.member_delegation = v.member.delegation
       v.member_identifier = v.member.identifier
       v.member_identifierType = v.member.identifierType
       delete v.member
       return v
     })
     const buffer = await writeToBuffer(members, this.csvDefaultOptions)
     return {
       data: buffer.toString('base64'),
       filename: 'halls.csv'
     }
   }

   async getActivities (): Promise<getActivitiesDto> {
     const activities = await this.hallRepository.createQueryBuilder('hall').select('hall.activity').distinct(true).getRawMany()
     const data = activities.map((activity) => activity.hall_activity)
     return {
       data
     }
   }
}
