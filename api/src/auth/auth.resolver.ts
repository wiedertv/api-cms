import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { LoginInputDto, LoginResponseDto, LoginAppDto, LoginAppResponseDto } from '../DTO/auth/login.dto'

import { AuthService } from './auth.service'

@Resolver('Auth')
export class AuthResolver {
  constructor (private readonly authService: AuthService) {}

  @Mutation(() => LoginResponseDto, { name: 'login' })
  async login (
    @Args('loginPayload', { type: () => LoginInputDto })
      { email, password }: LoginInputDto
  ): Promise<LoginResponseDto> {
    return await this.authService.login({ email, password })
  }

  @Mutation(() => LoginAppResponseDto)
  async LoginApp (@Args('payload', { type: () => LoginAppDto }) payload: LoginAppDto): Promise<LoginAppResponseDto> {
    return await this.authService.loginApp(payload)
  }
}
