import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { UsersRepository } from '../database/repositories/users.repository'
import { RoleEnum } from '../DTO/enums/role.enum'
import { CreateUserDto } from '../DTO/users/createUser.dto'
import { DeleteUserResponseDto } from '../DTO/users/deleteUser.dto'
import { UsersDto } from '../DTO/users/users.dto'
import { MailerService } from '../mailer/mailer.service'

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly mailer: MailerService
  ) {}

  async create (newUser: CreateUserDto) {
    newUser.role = RoleEnum.Admin
    return await this.usersRepository.save({ ...newUser })
  }

  async findOneById (id: number): Promise<UsersDto> {
    return await this.usersRepository.findOneOrFail(id)
  }

  async update (user: UsersDto, password: string) {
    return await this.usersRepository.save({ ...user, password })
  }

  async findOne (obj): Promise<UsersDto> {
    return await this.usersRepository.findOne({ where: obj })
  }

  async findAdmins (id): Promise<UsersDto[]> {
    return await this.usersRepository.createQueryBuilder('users').where('id != :id', { id }).getMany()
  }

  async inviteAdmin (inviteOptions) {
    const user = await this.findOne({ email: inviteOptions.email })
    if (!user) {
      inviteOptions.body = { password: this.generatePassword() }
      inviteOptions.subject = 'Bienvenido'
      const newUser = await this.create({
        email: inviteOptions.email,
        lastName: 'Orden de Malta',
        name: 'Administrador',
        password: inviteOptions.body.password
      })
      const { message } = await this.mailer.sendMail(inviteOptions, 'default')
      return { message, email: inviteOptions.email, id: newUser.id }
    }
    throw new Error('This User is already Invited')
  }

  async recoveryCode (email: string) {
    const user = await this.usersRepository.findOne({ where: { email } })
    if (user) {
      const password = this.generatePassword()
      await this.update(user, password)
      const { message } = await this.mailer.sendMail({ email, subject: 'Recuperar contraseña', body: { password } }, 'recovery')
      return { message, email, id: user.id }
    }
    throw new NotFoundException('This email doesnt exist')
  }

  async revokeAdminPermission (id: number): Promise<DeleteUserResponseDto> {
    const user = await this.findOneById(id)
    await this.usersRepository.delete(id)
    return { message: `[ADMIN: ${user.email}] has been revoked`, email: user.email, id }
  }

  comparePassword (attempt: string, password: string): boolean {
    return bcrypt.compareSync(attempt, password)
  }

  generatePassword () {
    return Math.random().toString(36).slice(6).toUpperCase()
  }
}
