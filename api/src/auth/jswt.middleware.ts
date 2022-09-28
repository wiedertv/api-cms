import {
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common'

import { AuthService } from './auth.service'

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  constructor (private readonly authService: AuthService) {}

  async use (req, res, next) {
    try {
      await this.authService.decodeRequest(req)
    } catch (err) {
      throw new UnauthorizedException(
        err.name && err.name === 'TokenExpiredError'
          ? 'Expired token'
          : 'Invalid token'
      )
    }
    next()
  }
}
