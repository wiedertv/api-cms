import { UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AdminInterceptor } from '../auth/auth.interceptor'
import { GqlAuthGuard } from '../auth/graphql-auth.guard'
import { User as CurrentUser } from '../decorators/user.decorator'
import { RegisterDto, RegisterResponseDto } from '../DTO/auth/register.dto'
import { CreateUserDto } from '../DTO/users/createUser.dto'
import { DeleteUserResponseDto } from '../DTO/users/deleteUser.dto'
import { UpdateUserInputDto, UpdateUserResponseDto } from '../DTO/users/updateUser.dto'
import { UsersDto } from '../DTO/users/users.dto'
import { UsersService } from './users.service'

@Resolver('Users')
export class UsersResolver {
  constructor (private usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Query(() => UsersDto)
  async getOneUser (@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOneById(id)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Query(() => [UsersDto])
  async getAdmins (@CurrentUser() user): Promise<UsersDto[]> {
    return await this.usersService.findAdmins(user.id)
  }

  @Mutation(() => UsersDto)
  async createUser (@Args({ name: 'input', type: () => CreateUserDto }) input: CreateUserDto): Promise<CreateUserDto> {
    return this.usersService.create(input)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => RegisterResponseDto, { name: 'inviteAdmin' })
  async inviteAdmin (
    @CurrentUser() user,
    @Args('registerPayload', { type: () => RegisterDto })
      registerPayload: RegisterDto
  ): Promise<RegisterResponseDto> {
    return await this.usersService.inviteAdmin(registerPayload)
  }

  @Mutation(() => UpdateUserResponseDto)
  async recoveryCode (@Args('input') { email }: UpdateUserInputDto): Promise<UpdateUserResponseDto> {
    return this.usersService.recoveryCode(email)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => DeleteUserResponseDto)
  async revokeAdmin (@CurrentUser() user, @Args('id') id: number): Promise<DeleteUserResponseDto> {
    return this.usersService.revokeAdminPermission(id)
  }
}
