import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { MembersModule } from '../members/members.module'
import { UsersModule } from '../users/users.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

export const passportModule = PassportModule.register({
  defaultStrategy: 'jwt'
})
@Module({
  imports: [
    forwardRef(() => MembersModule),
    forwardRef(() => UsersModule),
    passportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        return {
          secret: configService.get('auth.privateKey'),
          signOptions: configService.get('auth.options')
        }
      }
    })
  ],
  providers: [AuthService, JwtStrategy, AuthResolver],
  exports: [passportModule, AuthService]
})
export class AuthModule { }
