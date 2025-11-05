import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ReportStatus from '#models/report_status'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await ReportStatus.createMany([
      { name: 'Pendiente' },//verde
      { name: 'En Proceso' },//amarillo
      { name: 'Resuelto' },//azul
      { name: 'Rechazado' },//rojo
    ])
  }
} 