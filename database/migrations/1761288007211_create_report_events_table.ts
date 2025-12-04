import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'report_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('report_id').unsigned().references('id').inTable('reports').onDelete('CASCADE')
      table.integer('report_status_id').unsigned().references('id').inTable('report_statuses').onDelete('CASCADE')
      table.text('description').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  } 
}