import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { ContentFeedModule } from '../content-feed/content-feed.module'
import { EventsModule } from '../events/events.module'
import { MagazineModule } from '../magazine/magazine.module'
import { MailerSettingsModule } from '../mailer-settings/mailer-settings.module'
import { MembersModule } from '../members/members.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { PermissionsModule } from '../permissions/permissions.module'
import { ScheduledMessageModule } from '../scheduled-message/scheduled-message.module'
import { UsersModule } from '../users/users.module'

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  constructor (private readonly configService: ConfigService, private readonly authService: AuthService) {}
  createGqlOptions (): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      context: ({ req, res }) => ({ req, res }),
      subscriptions: {
        onConnect: (con: any) => {
          const authToken = con.Authorization || null
          if (authToken) {
            return this.authService.decodeToken(authToken.split(' ')[1])
          } else {
            throw new UnauthorizedException('authToken must be provided')
          }
        }
      },
      resolverValidationOptions: {
        requireResolversForResolveType: false
      },
      include: [
        AuthModule,
        UsersModule,
        PermissionsModule,
        ScheduledMessageModule,
        EventsModule,
        MagazineModule,
        ContentFeedModule,
        MailerSettingsModule,
        MembersModule,
        NotificationsModule
      ],
      debug: this.configService.get('graphql.debug'),
      introspection: true,
      playground: true,
      cors: false
    }
  }
}
