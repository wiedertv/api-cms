import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import * as moment from 'moment-timezone'
import { ScheduledMessageService } from './scheduled-message/scheduled-message.service'
import { EventsService } from './events/events.service'
import { ContentFeedService } from './content-feed/content-feed.service'
import { NotificationsService } from './notifications/notifications.service'

@Injectable()
export class TasksService {
  constructor (private readonly gospelsService: ScheduledMessageService, private readonly eventsService: EventsService,
              private readonly contentFeedService: ContentFeedService,
              private readonly notificationService: NotificationsService) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_6AM, { timeZone: 'Europe/Madrid' })
  async handleCron () {
    try {
      this.logger.log(`Running cronjob at ${moment().tz('Europe/Madrid')}`)
      const [payload] = await this.gospelsService.getToday()
      const [event] = await this.eventsService.getToday()
      const [entrie] = await this.contentFeedService.getToday()
      await this.notificationService.delete()
      if (Number(moment().tz('Europe/Madrid').format('h')) >= 5) {
        if (event) {
          this.logger.log(`publishing event at ${moment().tz('Europe/Madrid').format('h')}`)
          event.released = true
          await this.eventsService.update(event)
        }
        if (payload) {
          this.logger.log(`publishing gospel at ${moment().tz('Europe/Madrid').format('h')}`)
          payload.released = true
          await this.gospelsService.update(payload)
        }
        if (entrie) {
          this.logger.log(`publishing entrie at ${moment().tz('Europe/Madrid').format('h')}`)
          entrie.released = true
          await this.contentFeedService.update(entrie)
        }
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}
