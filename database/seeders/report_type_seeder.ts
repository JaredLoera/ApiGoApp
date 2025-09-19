import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ReportType from '#models/report_type'
export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await ReportType.createMany([
      { name: 'Problema de Agua' },
      { name: 'Problema de Electricidad' },
      { name: 'Daños en la Carretera' },
      { name: 'Recolección de Basura' },
      { name: 'Seguridad Pública' },
      { name: 'Queja por Ruido' },
      { name: 'Calidad del Aire' },
      { name: 'Baches en la carretera' },
      { name: 'Iluminación Pública' },
      { name: 'Transporte Público' },
      { name: 'Otro' },
    ])
  }
}