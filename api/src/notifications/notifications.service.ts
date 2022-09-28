import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PubSubEngine } from 'graphql-subscriptions'
import { NotificationsEntity } from '../database/entities/notifications.entity'
import { NotificationsRepository } from '../database/repositories/notifications.repository'
import { MembersService } from '../members/members.service'
import { Members } from '../database/entities/members.entity'

@Injectable()
export class NotificationsService {
  constructor (
    @InjectRepository(NotificationsEntity)
    private readonly notificationsRepository: NotificationsRepository,
    private readonly membersService: MembersService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine
  ) {}

  async create (payload) {
    const members = await this.membersService.setNotifications()
    for (const member of members) {
      const notification = await this.notificationsRepository.save({ ...payload, member })
      this.pubSub.publish('notificationadded', { notificationadded: notification })
    }
    return { message: 'success' }
  }

  async delete () {
    const notifications = await this.notificationsRepository.createQueryBuilder('notification')
      .select('notification.id', 'id')
      .where('read = true')
      .orWhere("notification.createdAt < NOW() - INTERVAL '30 days'")
      .getRawMany()
    await this.notificationsRepository.remove(notifications)
    return 'success'
  }

  async read (id) {
    await this.notificationsRepository.createQueryBuilder('notification').update().set({ read: true }).where('member = :id', { id }).execute()
    return await this.notificationsRepository.find({ where: { member: id } })
  }

  async getNotifications (member) {
    return await this.notificationsRepository.find({ where: { member, read: false }, relations: ['member'] })
  }

  async createAsyncNotification (payload) {
    const notification = await this.notificationsRepository.save({ ...payload })
    this.pubSub.publish('notificationadded', { notificationadded: notification })
    return { message: 'success' }
  }

  async sendNotificationFromSubscribers (title:string, description:string, members:Members[], link?:string) {
    const promises = []
    for (const member of members) {
      promises.push(this.createAsyncNotification({
        title,
        description,
        read: false,
        link: link || ' ',
        member
      }))
    }
    await Promise.all(promises)
  }
}
