import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MagazineEntity } from '../database/entities/magazine.entity'
import { MagazineRepository } from '../database/repositories/magazine.repository'
import { RoleEnum } from '../DTO/enums/role.enum'
import { AllMagazineResponseDto, MagazineDto } from '../DTO/magazine/getMagazine.dto'
import { UpdateMagazineInputDto } from '../DTO/magazine/updateMagazine.dto'
import { parsePermissions } from '../permissions/permissions.utils'
import { S3Service } from '../s3/s3.service'
import { MagazineInputDto } from '../DTO/magazine/createMagazine.dto'

@Injectable()
export class MagazineService {
  constructor (
    @InjectRepository(MagazineEntity)
    private readonly magazineRepository: MagazineRepository,
    private readonly s3Service: S3Service
  ) {}

  async getAll (offset: number, limit: number, order, filter, user, key?): Promise<AllMagazineResponseDto> {
    const totalCount = await this.magazineRepository.count()
    const direction = key && key !== 'empty' ? (key.slice(0, 1) === '+' ? 'DESC' : 'ASC') : null
    const columnKey = key && key !== 'empty' ? key.slice(1) : null
    let query = this.magazineRepository
      .createQueryBuilder('news')
      .orderBy(`news.${columnKey || order[0]}`, direction || order[1])
      .offset(offset)
      .limit(limit)

    if (filter.length) query = query.where('category = :category', { category: filter })
    let data = await query.getMany()
    if (user !== RoleEnum.Admin) data = await parsePermissions(data, user)
    return {
      count: totalCount,
      offset,
      limit,
      order,
      key: key || '',
      data
    }
  }

  async getOne (id: number): Promise<MagazineDto> {
    return await this.magazineRepository.findOne(id)
  }

  async create (payload: MagazineInputDto): Promise<MagazineDto> {
    try {
      const { filename } = await payload.pdf
      payload.pdfName = filename
      payload.pdf = await this.s3Service.uploadFile(payload.pdf)
      return await this.magazineRepository.save({ ...payload })
    } catch (e) {
      throw new InternalServerErrorException({ code: '[CREATE_EVENT]', message: `${e}` })
    }
  }

  async update (payload: UpdateMagazineInputDto): Promise<MagazineDto> {
    try {
      const magazine = await this.magazineRepository.findOne(payload.id)
      if (payload.pdf && payload.pdf !== magazine.pdf) {
        const { filename } = await payload.pdf
        payload.pdfName = filename
        payload.pdf = await this.s3Service.uploadFile(payload.pdf)
      }
      await this.magazineRepository
        .createQueryBuilder('magazine')
        .update(MagazineEntity)
        .set({ ...payload })
        .where('id = :id', { id: payload.id })
        .execute()
      return await this.magazineRepository.findOne(payload.id)
    } catch (e) {
      throw new InternalServerErrorException({ code: '[CREATE_EVENT]', message: `${e}` })
    }
  }

  async delete (id) {
    await this.magazineRepository.delete(id)
    return { id }
  }
}
