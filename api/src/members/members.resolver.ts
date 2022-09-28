import { UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User as CurrentUser } from 'src/decorators/user.decorator'
import { AdminInterceptor } from '../auth/auth.interceptor'
import { GqlAuthGuard } from '../auth/graphql-auth.guard'
import { GetAllFilterPipe } from '../decorators/getallmembers.decorator'
import { RegisterAppDto } from '../DTO/members/createMember.dto'
import { DownloadDataDto, DownloadTableDto } from '../DTO/members/downloadTableDto'
import { FilterMemberDto, MembersResponseDto, MemberWithQrDto } from '../DTO/members/getMember.dto'
import { MembersService } from './members.service'
import { UpdateMemberDto } from '../DTO/members/updateMember.dto'
import { Members } from '../database/entities/members.entity'
import { HallService } from '../hall/hall.service'
import { FilterGetAllHallDto, GetAllHallDto } from '../DTO/hall/getHall.dto'
import { getActivitiesDto } from 'src/DTO/hall/getActivities.dto'

@Resolver('Members')
export class MembersResolver {
  constructor (private readonly membersService: MembersService,
               private readonly hallService: HallService) {}

  @Mutation(() => Members)
  registerApp (@Args('payload', { type: () => RegisterAppDto }) payload: RegisterAppDto,
               @Args('isCms', { type: () => Boolean, nullable: true })isCms = false) {
    return this.membersService.register(payload, isCms)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => MemberWithQrDto)
  getMember (@CurrentUser() member) {
    return this.membersService.getMemberWithQR(member.id)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Query(() => MembersResponseDto)
  getAllMembers (
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
    @Args('order', { type: () => [String], nullable: true }) order = ['id', 'ASC'],
    @Args('key', { type: () => String, nullable: true }) key: string,
    @Args('search', { type: () => String, nullable: true }) search: string,
    @Args('filter', GetAllFilterPipe) filter: FilterMemberDto
  ) {
    return this.membersService.getAll(offset, limit, order, key, search, filter)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Members)
  updateMember (
    @CurrentUser() member,
    @Args('lastPassword', { type: () => String }) lastPassword: string,
    @Args('password', { type: () => String }) password: string
  ) {
    return this.membersService.updatePassword(member.id, lastPassword, password)
  }

  @Query(() => Boolean)
  async checkMemberExist (@Args('email', { type: () => String }) email: string, @Args('identifier', { type: () => String }) identifier: string) {
    return !!(await this.membersService.checker({ email, identifier }))
  }

  @Query(() => String)
  recoveryPassword (@Args('member', { type: () => String }) member: string) {
    return this.membersService.recoveryPassword(member)
  }

  @Query(() => Members)
  confirmMail (@Args('token', { type: () => String }) token: string) {
    return this.membersService.confirmEmail(token)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  triggerConfirmEmail (@Args('email', { type: () => String }) email: string) {
    return this.membersService.triggerMembersWelcomeEmail(email)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DownloadTableDto)
  downloadMembersAsCsv (@Args('payload', { type: () => DownloadDataDto }) payload: DownloadDataDto) {
    return this.membersService.downloadMembers(payload)
  }

  @Mutation(() => Members)
  changeMemberPassword (@Args('token', { type: () => String }) token: string, @Args('password', { type: () => String }) password: string) {
    return this.membersService.changePassword(token, password)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => MemberWithQrDto)
  getOneMember (@Args('id', { type: () => Int }) id: number): Promise<MemberWithQrDto> {
    return this.membersService.getOne({ where: { id }, relations: ['location'] })
  }

  /*
  @Query(() => Members)
  getOneMemberWithToken (@Args('token', { type: () => String }) token: string) {
    return this.membersService.getMemberWithToken(token)
  }
*/

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => Members)
  updateMemberCms (@Args('payload', { type: () => UpdateMemberDto }) payload: UpdateMemberDto, @Args('id', { type: () => Int }) id: number) {
    return this.membersService.update(id, payload)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => String)
  deleteMember (@Args('id', { type: () => Int }) id: number) {
    return this.membersService.delete(id, true)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Query(() => GetAllHallDto)
  getHallsInformation (
          @Args('offset', { type: () => Int }) offset: number,
          @Args('limit', { type: () => Int }) limit: number,
          @Args('order', { type: () => [String], nullable: true }) order = ['id', 'ASC'],
          @Args('key', { type: () => String, nullable: true }) key: string,
          @Args('search', { type: () => String, nullable: true }) search: string,
          @Args('filter', GetAllFilterPipe) filter: FilterGetAllHallDto
  ) {
    return this.hallService.getAll(offset, limit, order, key, search, filter)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Mutation(() => DownloadTableDto)
  downloadDataHalls (@Args('payload', { type: () => DownloadDataDto }) payload: DownloadDataDto) {
    return this.hallService.downloadDataHalls(payload)
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  @Query(() => getActivitiesDto)
  getActivities () {
    return this.hallService.getActivities()
  }
}
