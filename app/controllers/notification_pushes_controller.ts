import type { HttpContext } from '@adonisjs/core/http'

import PushSubscription from "#models/push_subscription"
import { PushService } from '#services/push_service'

export default class NotificationPushesController {
    public async subscribe({ request }: HttpContext) {
        const subscription = request.input('subscription')

        await PushSubscription.create({ subscription })

        return { message: 'Subscribed!' }


    }
    public async sendTestNotification({ }: HttpContext) {
        const subs = await PushSubscription.all()
        const push = new PushService()

        for (const sub of subs) {
            await push.sendNotification(sub.subscription, {
                title: 'Nuevo evento!',
                body: 'Se registró un cambio en el sistema.',
            })
        }

        return { done: true }
    }
}