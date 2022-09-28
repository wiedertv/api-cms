import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { IncomingMessage } from 'http'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'

interface JwtStrategyOptions {
  algorithm?: string[];
  audience?: any;
  ignoreExpiration?: boolean;
  issuer?: any;
  jwtFromRequest: (request: IncomingMessage) => string;
  passReqToCallback?: boolean;
  secretOrKey?: string;
  secretOrKeyProvider?: (request: IncomingMessage, rawJwtToken: string, done: Function) => string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.privateKey')
    } as JwtStrategyOptions)
  }

  validate (payload) {
    return this.authService.validate(payload)
  }
}
