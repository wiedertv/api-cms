import { UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AdminInterceptor } from '../auth/auth.interceptor'
import { GqlAuthGuard } from '../auth/graphql-auth.guard'
import { User as CurrentUser } from '../decorators/user.decorator'
import { CreateAppointmentDto, CreateAppointmentResponseDto } from '../DTO/mailerSettings/createAppointment.dto'
import { CreateSuggestionDto, CreateSuggestionResponseDto } from '../DTO/mailerSettings/createSuggestion.dto'
import { MailerSettingsDto, MailerSettingsInputDto } from '../DTO/mailerSettings/mailerSettings.dto'
import { MailerSettingsService } from './mailer-settings.service'

@Resolver('MailerSettings')
export class MailerSettingsResolver {
  constructor (private mailerSettingsService: MailerSettingsService) {}
  @Query(() => [MailerSettingsDto])
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  async getMailerSettings () {
    return await this.mailerSettingsService.get()
  }

  @Query(() => MailerSettingsDto)
  @UseGuards(GqlAuthGuard)
  async getMSByDelegation (@CurrentUser() user, @Args('delegation', { type: () => String }) delegation: string) {
    return await this.mailerSettingsService.getByDelegation(delegation)
  }

  @Query(() => MailerSettingsDto)
  @UseGuards(GqlAuthGuard)
  async getMSById (@Args('id', { type: () => Int }) id: number) {
    return await this.mailerSettingsService.getOne(id)
  }

  @Mutation(() => [MailerSettingsDto])
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(AdminInterceptor)
  async updateMailerSettings (@Args('payload', { type: () => [MailerSettingsInputDto] }) payload: MailerSettingsInputDto[]) {
    return await this.mailerSettingsService.update(payload)
  }

  @Mutation(() => CreateAppointmentResponseDto)
  @UseGuards(GqlAuthGuard)
  async createAppointment (@Args('payload', { type: () => CreateAppointmentDto }) payload: CreateAppointmentDto) {
    return await this.mailerSettingsService.createAppointment(payload)
  }

  @Mutation(() => CreateSuggestionResponseDto)
  @UseGuards(GqlAuthGuard)
  async sendSuggestion (@CurrentUser() member, @Args('payload', { type: () => CreateSuggestionDto }) payload: CreateSuggestionDto) {
    return await this.mailerSettingsService.sendSuggestion(payload, member)
  }
}
