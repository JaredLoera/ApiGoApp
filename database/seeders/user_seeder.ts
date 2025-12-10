import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
    // Usuario 1
    await User.create({
      full_name: 'Azeneth Martinez',
      email: 'aze.mtz.glz@gmail.com',
      password: 'aze.mtz.glz@gmail.com',   // cambia la contraseña si quieres
      role_id: 1
    })

    // Usuario 2
    await User.create({
      full_name: 'Jared Salazar',
      email: 'jared.salazar@gmail.com',
      password:'jared.salazar@gmail.com',
      role_id: 2
    })
  }
}