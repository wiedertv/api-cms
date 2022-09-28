import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { FormatterOptionsArgs, writeToBuffer } from 'fast-csv'
import * as moment from 'moment'
import { QRCodeToDataURLOptions, toDataURL } from 'qrcode'
import { Members } from 'src/database/entities/members.entity'
import { Brackets, Repository } from 'typeorm'
import { AuthService } from '../auth/auth.service'
import { Backup } from '../database/entities/backup.entity'
import { LocationsBackup } from '../database/entities/locationBackup.entity'
import { LocationsEntity } from '../database/entities/locations.entity'
import { BackupRepository } from '../database/repositories/backup.repository'
import { LocationsRepository } from '../database/repositories/locations.repository'
import { MembersRepository } from '../database/repositories/members.repository'
import { RoleEnum } from '../DTO/enums/role.enum'
import { CreateMemberFromSugarDTO, RegisterAppDto } from '../DTO/members/createMember.dto'
import { DownloadDataDto, DownloadTableDto } from '../DTO/members/downloadTableDto'
import { FilterMemberDto, MemberWithQrDto } from '../DTO/members/getMember.dto'
import { UpdateMemberDto, UpdateMemberFromControllerDto } from '../DTO/members/updateMember.dto'
import { MailerService } from '../mailer/mailer.service'
import { v4 as uuidv4 } from 'uuid'
import { DelegationEnum } from 'src/DTO/enums/delegation.enum'

@Injectable()
export class MembersService {
  private readonly qrDefaultConfig: QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'medium',
    type: 'image/png'

  };

  private readonly csvDefaultOptions: FormatterOptionsArgs<any, any> = {
    delimiter: ',',
    headers: true,
    writeHeaders: true
  };

  private readonly maltaPublic;

  constructor (
      @InjectRepository(Members)
      private readonly membersRepository: MembersRepository,
      private readonly config: ConfigService,
      @InjectRepository(LocationsEntity)
      private readonly locationsRepository: LocationsRepository,
      @InjectRepository(Backup)
      private readonly backupRepository: BackupRepository,
      @InjectRepository(LocationsBackup)
      private readonly lbackupRepository: Repository<LocationsBackup>,
      private readonly mailerService: MailerService,
      @Inject(forwardRef(() => AuthService))
      private readonly authService: AuthService
  ) {
    this.maltaPublic = this.config.get<string>('maltaPublic')
  }

  async register (payload: RegisterAppDto, isCms: Boolean): Promise<Members> {
    try {
      let sendToMalta = false
      payload.identifier = payload.identifier.toUpperCase().trim()
      const member = await this.checkInBackup({
        identifier: payload.identifier,
        identifierType: payload.identifierType
      })
      if (member) {
        payload.name = member.name
        payload.lastName = member.lastName
        payload.role = RoleEnum[member.role]
        payload.customID = member.customID
        payload.delegation = member.delegation === '-' ? DelegationEnum.none : DelegationEnum[member.delegation]
        payload.email = member.email ? member.email : payload.email

        const memberLocation = await this.checkInLBackUp(payload.identifier)
        if (memberLocation) payload.location = await this.locationsRepository.save({ ...memberLocation })
      } else {
        payload.customID = uuidv4()
        if (payload.location) {
          payload.location = await this.locationsRepository.save({ ...payload.location })
        } else {
          payload.location = await this.locationsRepository.save({})
        }

        payload.role = isCms ? payload.role : RoleEnum.contactoInteres
        sendToMalta = !isCms
      }
      const newUser = await this.membersRepository.save({ ...payload })
      await this.confirmAccountMail(newUser)
      if (sendToMalta) {
        this.mailerService.sendMail({
          email: 'comunicacion@ordendemalta.es',
          subject: 'Nuevo miembro de la Orden de Malta',
          body: {
            userData: newUser
          }
        }, 'newMember')
      }
      return newUser
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async createMemberFromSugar (body: CreateMemberFromSugarDTO): Promise<Members> {
    try {
      const existMemberPromise = this.checker({ email: body.email, identifier: body.identifier })
      const existMemberOnBackupPromise = this.checkInBackup(body)
      const [existMember, existMemberOnBackup] = await Promise.all([existMemberPromise, existMemberOnBackupPromise])
      console.log({ existMember, existMemberOnBackup })
      if (existMember || existMemberOnBackup) {
        throw new BadRequestException({
          message: `El miembro ya existe en ${existMember ? 'App' : 'Backup'}`,
          customID: existMember ? existMember.customID : existMemberOnBackup.customID
        })
      }

      if (body.location) {
        body.location = await this.locationsRepository.save({ ...body.location })
      } else {
        body.location = await this.locationsRepository.save({})
      }
      const newMember = {
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        customID: uuidv4(),
        delegation: body.delegation,
        confirmed: false,
        identifier: body.identifier,
        identifierType: body.identifierType,
        isUpdated: true,
        password: this.generatePassword(),
        location: body.location,
        role: body.role
      }
      const member = this.membersRepository.save({ ...newMember })
      this.mailerService.sendMail({
        email: newMember.email,
        subject: 'Bienvenido a la aplicación de la Orden de Malta',
        body: {
          password: newMember.password,
          applink: ''
        }
      }, 'create-member-sugar')
      return member
    } catch (e) {
      Logger.log(e, '[MemberService]')
      throw new BadRequestException(e)
    }
  }

  async setNotifications () {
    return await this.membersRepository.find()
  }

  async getAll (offset?, limit?, order?, key?, search?: string, filter?: FilterMemberDto) {
    const direction = key && key !== 'empty' ? (key.slice(0, 1) === '+' ? 'DESC' : 'ASC') : null
    const columnKey = key && key !== 'empty' ? key.slice(1) : null
    const query = await this.membersRepository
      .createQueryBuilder('member')
      .orderBy(`member.${columnKey || order[0]}`, direction || order[1])
      .offset(offset)
      .limit(limit)
      .innerJoinAndSelect('member.location', 'location')
    if (filter) {
      query.where({})
      const { startDate, endDate, delegations, isUpdated, roles } = filter
      if (Array.isArray(delegations) && delegations.length) query.andWhere('member.delegation in (:...delegations)', { delegations })
      if (isUpdated) query.andWhere('member.isUpdated = :isUpdated', { isUpdated })
      if (Array.isArray(roles) && roles.length) query.andWhere('member.role in (:...roles)', { roles })
      if (!!startDate && !!endDate) {
        query.andWhere(new Brackets((qb) => qb.where('member.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate
        })))
      }
      if (!!startDate && !endDate) {
        query.andWhere('member.createdAt BETWEEN :startDate AND NOW()', { startDate })
      }
      if (!!endDate && !startDate) {
        const start = moment.utc('01/01/2020', 'DD/MM/YYYY').startOf('day').toISOString()
        query.andWhere('member.createdAt BETWEEN :start AND :endDate', { start, endDate })
      }
    }
    if (search) {
      query.andWhere(
        new Brackets((qb) =>
          qb.where(
            'LOWER(member.name) like :search OR LOWER(member.lastName) like :search OR LOWER(member.email) like :search OR LOWER(member.identifier) like :search',
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

  async getWhere (allowed: string[]) {
    allowed = allowed.map((value) => {
      switch (value) {
        case 'Miembros':
          return 'miembro'
        case 'Voluntarios':
          return 'voluntario'
        case 'Empleados':
          return 'empleado'
        case 'Beneficiarios':
          return 'beneficiario'
        case 'Amigos':
          return 'amigo'
        case 'Contactos de interés':
          return 'contactoInteres'
        default:
          break
      }
    })
    return await this.membersRepository.createQueryBuilder('member').where('member.role IN (:...var)', { var: allowed }).getMany()
  }

  async getOne (opt): Promise<MemberWithQrDto> {
    const member = await this.membersRepository.findOne(opt)
    if (!member) throw new NotFoundException('This member does not exist')
    const qrMember = { serialNumber: member.customID }
    const qr = await toDataURL(JSON.stringify(qrMember), this.qrDefaultConfig)
    return { ...member, qr } as MemberWithQrDto
  }

  async getOneFromController (customID) {
    const memberPromise = this.membersRepository.findOne({ where: { customID }, relations: ['location'] })
    const backupPromise = this.backupRepository.findOne({ where: { customID } })
    const [member, backup] = await Promise.all([memberPromise, backupPromise])

    if (!member) {
      if (!backup) {
        throw new NotFoundException()
      }

      const location = await this.lbackupRepository.findOne({ userIdentifier: backup.identifier })

      const response = { ...backup, location }
      return response
    }

    return member
  }

  async getMemberWithQR (id: number) {
    const member = await this.membersRepository.findOne(id, { relations: ['location'] })

    const qrMember = { serialNumber: member.customID }
    const qr = await toDataURL(JSON.stringify(qrMember), this.qrDefaultConfig)

    return { ...member, qr }
  }

  async update (memberId: string | number, payload: UpdateMemberDto): Promise<Members | Backup> {
    try {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

      if (payload.email && !emailRegex.test(payload.email)) throw new Error('Email is not a valid email')
      const member = await this.membersRepository.findOneOrFail(memberId, { relations: ['location'] })

      if (!member) {
        throw new NotFoundException()
      }

      const location = await this.locationsRepository.findOne(member.location.id)

      if (payload.location !== location) {
        payload.location = await this.locationsRepository.save({ ...location, ...payload.location })
      }

      return this.membersRepository.save({ ...member, ...payload, isUpdated: true }) as Promise<Members>
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async updateFromController (memberId: string, payload: UpdateMemberFromControllerDto): Promise<Members | Backup> {
    let location
    console.log(payload)
    try {
      const findOneFromMember = await this.membersRepository.findOne({ where: { customID: memberId }, relations: ['location'] })
      const findOneFromBackup = await this.backupRepository.findOne({ where: { customID: memberId } })
      const member = findOneFromMember || findOneFromBackup

      if (!member) {
        throw new NotFoundException()
      }

      if (findOneFromMember) {
        location = await this.locationsRepository.findOne(findOneFromMember.location.id)

        if (payload.location !== location) {
          payload.location = await this.locationsRepository.save({ ...location, ...payload.location })
        }

        return this.membersRepository.save({ ...findOneFromMember, ...payload, isUpdated: true }) as Promise<Members>
      } else {
        location = await this.lbackupRepository.findOne({ userIdentifier: findOneFromBackup.identifier })

        if (payload.location !== location) {
          await this.lbackupRepository.save({ ...location, ...payload.location })
        }

        if (typeof payload.role === 'string') {
          const role = this.parseRole(payload.role)
          payload.role = RoleEnum[role]
          if (payload.role === null) throw new Error('role string is not valid')
        }
        console.log(payload.role)
        return this.backupRepository.save({ ...findOneFromBackup, ...payload })
      }
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async updatePassword (id: number, lastPassword: string, password: string) {
    try {
      if (password === lastPassword) throw new Error('You should use a different password')
      const member = await this.membersRepository.findOneOrFail(id, {
        select: ['id', 'email', 'name', 'isUpdated', 'lastName', 'identifier', 'identifierType', 'role', 'delegation', 'password', 'location'],
        relations: ['location']
      })
      if (member && this.comparePassword(lastPassword, member.password)) {
        return await this.membersRepository.save({ ...member, ...{ password } })
      }
      throw new Error('Password doesnt match with your last password')
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async recoveryPassword (memberData: string) {
    try {
      const member = await this.membersRepository.findOneOrFail({ where: [{ email: memberData }, { identifier: memberData }] })
      const subject = 'Cambio de contraseña'
      const token = await this.authService.generateMemberToken({ id: member.id, restorePassword: true }, member.email)
      const link = this.maltaPublic + 'recuperar-contraseña/' + token
      await this.mailerService.sendMail({ email: member.email, subject, body: { link } }, 'recoveryMember')
      return 'Mensaje enviado correctamente'
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  private async confirmAccountMail (newUser) {
    try {
      const subject = 'Confirmacion de Registro'
      const token = await this.authService.generateMemberToken({ id: newUser.id, confirmAccount: true }, newUser.email)
      const link = this.maltaPublic + 'confirmar-cuenta/' + token
      await this.mailerService.sendMail({ email: newUser.email, subject, body: { link } }, 'member-registration')
      return 'Done'
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async confirmEmail (token: string) {
    const { id, confirmAccount } = this.authService.decodeToken(token)
    if (confirmAccount) {
      await this.membersRepository.save({ id, ...{ confirmed: confirmAccount } })
      return this.membersRepository.findOne(id)
    }
  }

  async changePassword (token: string, password: string) {
    const { id, restorePassword } = this.authService.decodeToken(token)
    if (restorePassword) {
      await this.membersRepository.save({ id, ...{ password } })
      return this.membersRepository.findOne(id)
    }
  }

  async downloadMembers ({ data, all }: DownloadDataDto):Promise<DownloadTableDto> {
    let members
    if (all) {
      members = await this.membersRepository.find()
    } else {
      members = await this.membersRepository.createQueryBuilder('member').where('member.id in (:...ids)', { ids: data }).getMany()
    }
    const buffer = await writeToBuffer(members, this.csvDefaultOptions)
    return {
      data: buffer.toString('base64'),
      filename: 'members.csv'
    }
  }

  async delete (id: string | number, isCms: boolean = false) {
    try {
      if (isCms) {
        await this.membersRepository.findOneOrFail(id)
        await this.membersRepository.delete(id)
        return 'deleted'
      } else {
        const memberPromise = this.membersRepository.findOne({ where: { customID: id } })
        const backupPromise = this.backupRepository.findOne({ where: { customID: id } })
        const [member, backup] = await Promise.all([memberPromise, backupPromise])
        return await this.membersRepository.delete({ id: member.id || backup.id })
      }
    } catch (e) {
      throw new BadRequestException()
    }
  }

  checker ({ email, identifier }) {
    return this.membersRepository.findOne({ where: [{ email }, { identifier }] })
  }

  private comparePassword (attempt: string, password: string): boolean {
    return bcrypt.compareSync(attempt, password)
  }

  parseRole (role) {
    const arrayRole = role.split(',').filter(Boolean)
    const order = ['miembro', 'empleado', 'voluntario', 'beneficiario', 'amigo', 'contactoInteres']
    for (const element of order) {
      const found = arrayRole.find((r) => r.toLowerCase() === element.toLowerCase())

      if (found) return found === 'contactoInteres' ? 'contactoInteres' : found.toLowerCase()
    }
    return null
  }

  private async checkInBackup ({ identifier, identifierType }): Promise<null | Partial<Members>> {
    const member: Backup = await this.backupRepository.findOne({ identifier, identifierType })
    if (!member) return null
    const role = this.parseRole(member.role)
    member.role = RoleEnum[role]
    return member as Partial<Members>
  }

  private async checkInLBackUp (identifier: string) {
    const location: LocationsBackup = await this.lbackupRepository.findOne({ userIdentifier: identifier })
    if (!location) return null
    delete location.userIdentifier
    return location as Partial<LocationsEntity>
  }

  getAllBackup (offset, limit) {
    return this.backupRepository.createQueryBuilder('backup').offset(offset).limit(limit).getManyAndCount()
  }

  generatePassword () {
    return Math.random().toString(36).slice(9).toUpperCase()
  }

  async triggerMembersWelcomeEmail (email): Promise<string> {
    const user = await this.membersRepository.findOne({ email: email.toLowerCase() }, {
      select: ['id', 'confirmed', 'email']
    })
    if (!user) throw new NotFoundException(`Usuario con el correo ${email}, No existe`)
    if (user.confirmed) throw new BadRequestException(`El usuario con el correo ${email}, ya ha sido confirmado`)
    return await this.confirmAccountMail(user)
  }
}
