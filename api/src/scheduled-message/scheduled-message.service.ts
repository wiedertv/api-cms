import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as moment from 'moment-timezone'
import { ScheduleMessageEntity } from '../database/entities/scheduleMessage.entity'
import { ScheduleMessageRepository } from '../database/repositories/scheduleMessage.repository'
import { ScheduleMessageDto, ScheduleMessageInputDto, ScheduleMessageUpdateDto } from '../DTO/scheduleMessage/scheduleMessage.dto'

@Injectable()
export class ScheduledMessageService {
  constructor (@InjectRepository(ScheduleMessageEntity)
    private readonly evangelioRepository: ScheduleMessageRepository) {
  }

  async getAll (offset, limit, order, key?) {
    const totalCount = await this.evangelioRepository.count()
    const direction = key && key !== 'empty' ? key.slice(0, 1) === '+' ? 'ASC' : 'DESC' : null
    const columnKey = key && key !== 'empty' ? key.slice(1) : null
    const data = await this.evangelioRepository.createQueryBuilder('gospel')
      .orderBy(`gospel.${columnKey || order[0]}`, direction || order[1])
      .offset(offset)
      .limit(limit)
      .getMany()
    return {
      count: totalCount,
      offset,
      limit,
      order,
      key: key || '',
      data
    }
  }

  async getFutureGospels (): Promise<ScheduleMessageDto[]> {
    let data = await this.evangelioRepository.createQueryBuilder()
      .where('released = :released', {
        released: false
      }).getMany()
    const today = await this.getToday()
    if (today) {
      data = data.concat(today)
    }
    return data
  }

  async getToday () {
    const date = moment().tz('Europe/Madrid').format('YYYY-MM-DD')
    return await this.evangelioRepository.query(`SELECT * from "ScheduleMessage" WHERE "releaseDate" LIKE '%${date}%'`)
  }

  async getReleasedGospel (): Promise<ScheduleMessageDto[]> {
    return await this.evangelioRepository.find({ where: { released: true } })
  }

  async getOneById (id: number) {
    return await this.evangelioRepository.findOneOrFail(id)
  }

  async create (payload: ScheduleMessageInputDto) {
    payload.released = false
    const { releaseDate } = payload
    const ACTUAL_DATE = new Date().toISOString().slice(0, 10)
    try {
      const message = await this.evangelioRepository.findOne({ where: { releaseDate } })
      if (message) { throw new BadRequestException('Change the release date please.') }
      if (moment.tz(releaseDate, 'Europe/Madrid').format('YYYY-MM-DD') ===
                moment().tz('Europe/Madrid').format('YYYY-MM-DD') &&
                Number(moment.tz(ACTUAL_DATE, 'Europe/Madrid').format('h')) >= 6) {
        payload.released = true
      }
      return await this.evangelioRepository.save({ ...payload })
    } catch (e) {
      throw new ConflictException({ code: '[CREATE_GOSPEL]', message: `${e}` })
    }
  }

  async update ({ id, ...payload }: ScheduleMessageUpdateDto) {
    try {
      const evangelio = await this.getOneById(id)
      if (payload.releaseDate !== evangelio.releaseDate) {
        payload.released = false
      }
      return await this.evangelioRepository.save({ ...evangelio, ...payload })
    } catch (e) {
      throw new ConflictException({
        code: '[UPDATE_EVANGELIO]',
        message: `Error updating Evangelio id:${id}, error: ${e}`
      })
    }
  }

  async delete (id) {
    try {
      await this.evangelioRepository.delete(id)
      return { message: `[Evangelio id:${id}] has been Deleted`, id }
    } catch (e) {
      throw new InternalServerErrorException({
        code: '[DELETE_EVANGELIO]',
        message: `Error, evangelio cannot be deleted, err:${e}`
      })
    }
  }
}
