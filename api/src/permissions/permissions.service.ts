import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PermissionsRepository } from '../database/repositories/permissions.repository'
import { PermissionsDto, PermissionsInputDto } from '../DTO/permissions/permissions.dto'

@Injectable()
export class PermissionsService {
  constructor (
        @InjectRepository(PermissionsRepository)
        private readonly permissionsRepository: PermissionsRepository) {
  }

  async get () {
    return await this.permissionsRepository.find({
      order: {
        id: 'ASC'
      }
    })
  }

  async getOne (name: string) {
    return await this.permissionsRepository.findOne({ where: { name } })
  }

  async write (data) {
    for (const [perm, allowed] of Object.entries(data.permissions)) {
      try {
        await this.permissionsRepository.save({ name: perm, allowed })
      } catch (e) {
        throw new ConflictException({ code: '[WRITE_PERMISSION_ERROR]', message: `Error writing the permissions data, ${e}` })
      }
    }
  }

  async update (data: PermissionsInputDto[]): Promise<PermissionsDto[]> {
    for (const value of data) {
      const { name, allowed } = value
      try {
        const perm = await this.permissionsRepository.findOneOrFail({ where: { name } })
        await this.permissionsRepository.save({ ...perm, name, allowed })
      } catch (e) {
        throw new ConflictException({ code: '[UPDATE_PERMISSION_ERROR]', message: `Error updating the permissions data, ${e}` })
      }
    }
    return await this.get()
  }
}
