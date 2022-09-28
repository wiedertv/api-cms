import * as Joi from '@hapi/joi'
import { ClassSerializerInterceptor, HttpModule, MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as bodyParser from 'body-parser'
import { ValidationError } from 'class-validator'
import * as compression from 'compression'
import * as rateLimit from 'express-rate-limit'
import * as helmet from 'helmet'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { JWTMiddleware } from './auth/jswt.middleware'
import { ClassValidatorErrorsToValidationExceptionFactory } from './common/pipes/validation-factory.pipe'
import configuration from './configuration/configuration'
import { GraphqlOptions } from './configuration/graphql.options'
import { ContentFeedModule } from './content-feed/content-feed.module'
import { EventsEntity } from './database/entities/events.entity'
import { LocationsEntity } from './database/entities/locations.entity'
import { Members } from './database/entities/members.entity'
import { NotificationsEntity } from './database/entities/notifications.entity'
import { ScheduleMessageEntity } from './database/entities/scheduleMessage.entity'
import { ContentFeedSubscriber } from './database/subscribers/content-feed.subscriber'
import { EventsSubscriber } from './database/subscribers/events.subscriber'
import { MagazineSubscriber } from './database/subscribers/magazine.subscriber'
import { MembersSubscriber } from './database/subscribers/members.subscriber'
import { GospelSubscriber } from './database/subscribers/scheduleMessage.subscriber'
import { UsersSubscriber } from './database/subscribers/users.subscriber'
import { EventsModule } from './events/events.module'
import { MagazineModule } from './magazine/magazine.module'
import { MailerSettingsModule } from './mailer-settings/mailer-settings.module'
import { MailerService } from './mailer/mailer.service'
import { MembersModule } from './members/members.module'
import { NotificationsModule } from './notifications/notifications.module'
import { PermissionsModule } from './permissions/permissions.module'
import { S3Service } from './s3/s3.service'
import { ScheduledMessageModule } from './scheduled-message/scheduled-message.module'
import { TasksService } from './taskSchedule.service'
import { UsersModule } from './users/users.module'

const appPipe = (cons: (errors: ValidationError[]) => any) => ({
  provide: APP_PIPE,
  useValue: new ValidationPipe({
    validationError: { target: false, value: false },
    exceptionFactory: cons
  })
})

const appInterceptor = <T>(cons: T) => ({
  provide: APP_INTERCEPTOR,
  useClass: cons
})
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5
      })
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('develop', 'production', 'test', 'staging').default('develop'),
        PORT: Joi.number().default(3000)
      }),
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('typeorm'),
      inject: [ConfigService]
    }),
    GraphQLModule.forRootAsync({
      imports: [AuthModule, ConfigModule],
      useClass: GraphqlOptions
    }),
    TypeOrmModule.forFeature([ScheduleMessageEntity, EventsEntity, LocationsEntity, NotificationsEntity, Members]),
    UsersModule,
    AuthModule,
    PermissionsModule,
    ScheduledMessageModule,
    ContentFeedModule,
    EventsModule,
    MagazineModule,
    MailerSettingsModule,
    NotificationsModule,
    MembersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MailerService,
    UsersSubscriber,
    GospelSubscriber,
    ContentFeedSubscriber,
    EventsSubscriber,
    MagazineSubscriber,
    MembersSubscriber,
    S3Service,
    TasksService,
    appInterceptor(ClassSerializerInterceptor),
    appPipe(ClassValidatorErrorsToValidationExceptionFactory)
  ]
})
export class AppModule {
  private readonly limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
  });

  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(
        bodyParser.json({ limit: '50mb' }),
        bodyParser.urlencoded({ limit: '50mb', extended: true }),
        compression(),
        helmet(),
        this.limiter
      )
      .forRoutes('*')
    consumer.apply(JWTMiddleware).forRoutes('/members')
  }
}
