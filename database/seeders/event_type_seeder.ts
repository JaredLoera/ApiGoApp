import { BaseSeeder } from '@adonisjs/lucid/seeders'
import EventType from '#models/event_type'

export default class extends BaseSeeder {
  async run() {
    await EventType.createMany([
      { name: 'Actualización' },
      { name: 'Rechazado' },
      { name: 'Trabajo detenido' },
      {name: 'Finalizado' },
    ])
  }
}