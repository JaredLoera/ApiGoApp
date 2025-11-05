import { DateTime } from 'luxon'
import { BaseModel, column, hasOne ,hasMany } from '@adonisjs/lucid/orm'
import type { HasOne , HasMany } from '@adonisjs/lucid/types/relations'

import ReportType from '#models/report_type'
import ReportStatus from '#models/report_status'
import User from '#models/user'
import ReportPhoto from '#models/report_photo'


export default class Report extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare reportTypeId: number

  @column()
  declare reportStatusId: number

  @column()
  declare description: string

  @column()
  declare latitude: string

  @column()
  declare longitude: string

  @hasOne(() => ReportType, {
    foreignKey: 'id',
    localKey: 'reportTypeId'
  })
  declare reportType: HasOne<typeof ReportType>

  @hasOne(() => ReportStatus, {
    foreignKey: 'id',
    localKey: 'reportStatusId'
  })
  declare reportStatus: HasOne<typeof ReportStatus>

  @hasOne(() => User, {
    foreignKey: 'id',
    localKey: 'userId'
  })
  declare user: HasOne<typeof User>

  @hasMany(() => ReportPhoto, {
    foreignKey: 'reportId',
    localKey: 'id'
  })
  declare photos: HasMany<typeof ReportPhoto>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async getAllReports() {
    return this.query().preload('reportType').preload('reportStatus').preload('user').preload('photos')
  }

  static async getReportById(id: number) {
    return this.query().where('id', id).preload('reportType').preload('reportStatus').preload('user').preload('photos').first()
  }

   static async getAllMyReportsDifferentByPending(user: User) {
    return this.query().whereNot('reportStatusId', 1).whereNot('reportStatusId', 2).where('userId', user.id).preload('reportType').preload('reportStatus').preload('user').preload('photos')
  }
  static async getAllActiveReports(user: User) {
    return this.query().whereNot('reportStatusId', 3).whereNot('reportStatusId', 4).where('userId', user.id).preload('reportType').preload('reportStatus').preload('user').preload('photos')
  }
}