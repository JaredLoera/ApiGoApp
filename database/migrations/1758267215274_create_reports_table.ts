import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.integer('report_type_id').unsigned().references('id').inTable('report_types').notNullable()
      table.integer('report_status_id').unsigned().references('id').inTable('report_statuses').notNullable().defaultTo(1)
      table.text('description').notNullable()
      table.string('latitude').notNullable()
      table.string('longitude').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}