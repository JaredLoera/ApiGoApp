import webpush from 'web-push'
import env from '#start/env'
export class PushService {
 constructor() {
    webpush.setVapidDetails(
      env.get('VAPID_EMAIL') || 'mailto:example@example.com',
      env.get('VAPID_PUBLIC_KEY') || '',
      env.get('VAPID_PRIVATE_KEY') || ''
    )
  }
  async sendNotification(subscription: any, payload: any) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload))
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }
}