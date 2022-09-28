import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { SignOptions } from 'jsonwebtoken'
import { LoginAppDto, LoginAppResponseDto, LoginDto, LoginResponseDto } from '../DTO/auth/login.dto'

import { UsersDto } from '../DTO/users/users.dto'
import { MembersService } from '../members/members.service'
import { UsersService } from '../users/users.service'
import { Members } from '../database/entities/members.entity'

@Injectable()
export class AuthService {
  private readonly issuer = this.configService.get('auth.options.issuer');
  private readonly audience = this.configService.get('auth.options.audience');
  private readonly expiresIn = this.configService.get('auth.options.expiresIn');
  private readonly expireReset = this.configService.get('auth.options.expireReset');

  constructor (
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => MembersService))
    private readonly membersService: MembersService
  ) {}

  async validate (payload): Promise<UsersDto | Members> {
    try {
      if (payload.type === 'user') {
        return await this.usersService.findOneById(payload.id)
      } else if (payload.type === 'member') {
        return await this.membersService.getOne(payload.id)
      }
    } catch (e) {
      throw new UnauthorizedException('Error', 'This user doesnt exist')
    }
  }

  async sign (user: UsersDto): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        type: 'user'
      },
      { expiresIn: this.configService.get('auth.options.expiresIn') }
    )
  }

  async signApp (member) {
    return await this.jwtService.signAsync(
      {
        id: member.id,
        role: member.role,
        identifier: member.identifier,
        email: member.email,
        name: member.name,
        lastname: member.lastName,
        type: 'member'
      },
      {
        expiresIn: this.configService.get('auth.options.expiresIn')
      }
    )
  }

  async login ({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findOne({ email })
    if (user && (await this.usersService.comparePassword(password, user.password))) {
      const token = await this.sign(user)
      return { user, token, message: 'success' }
    }
    throw new NotFoundException('This email doesnt exist')
  }

  async loginApp ({ username, password }: LoginAppDto): Promise<LoginAppResponseDto> {
    try {
      const member = await this.membersService.getOne({
        where: [{ email: username.toLowerCase().trim() }, { identifier: username.toUpperCase().trim() }],
        relations: ['location'],
        select: ['id', 'email', 'name', 'isUpdated', 'lastName', 'identifier', 'identifierType', 'role', 'delegation', 'password', 'confirmed']
      })
      if (member && (await this.usersService.comparePassword(password, member.password)) && member.confirmed === true) {
        const token = await this.signApp(member)
        return { member, token, message: 'success' }
      } else {
        throw new BadRequestException('you need to confirm your account')
      }
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async decodeRequest (request) {
    if (!request.headers || !request.headers.authorization) return false
    const token: string = request.headers.authorization.substr(7)
    const decodedToken = this.decodeToken(token)
    request.user = await this.usersService.findOneById(decodedToken.id)
    return decodedToken
  }

  decodeToken = (token) =>
    this.jwtService.verify(token, {
      audience: this.audience,
      issuer: this.issuer
    });

  generateToken (payload: object, subject: string, expiresIn?: string | number): string {
    const signOptions: SignOptions = {
      expiresIn: this.expiresIn,
      issuer: this.issuer,
      subject,
      audience: this.audience
    }
    if (expiresIn) signOptions.expiresIn = expiresIn
    return this.jwtService.sign(payload, signOptions)
  }

  generateMemberToken (payload: object, subject: string): string {
    return this.generateToken(payload, subject, this.expireReset)
  }
}
