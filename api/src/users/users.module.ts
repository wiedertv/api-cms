import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersRepository } from '../database/repositories/users.repository'
import { MailerService } from '../mailer/mailer.service'
import { UsersResolver } from './users.resolver'
import { UsersService } from './users.service'

@Module({
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  providers: [UsersResolver, UsersService, MailerService]
})
export class UsersModule {}
