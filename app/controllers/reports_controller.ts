import type { HttpContext } from '@adonisjs/core/http'
import ReportType from '#models/report_type'
import ReportStatus from '#models/report_status'
import Report from '#models/report'
import { reportValidator } from '#validators/report'

export default class ReportsController {

    public async reportTypes({ }: HttpContext) {
        // Fetch all report types from the database
        const reportTypes = await ReportType.all()
        return reportTypes
    }

    public async reportStatus({ }: HttpContext) {
        // Fetch all report statuses from the database
        const reportStatuses = await ReportStatus.all()
        return reportStatuses
    }

    public async index({ }: HttpContext) {
        // Fetch all reports from the database
        const reports = await Report.all()
        return reports
    }

    public async store({ request, response }: HttpContext) {
        const data = request.all()
        const validatedData = await reportValidator.validate(data)

        if (await Report.create(validatedData)) {
            response.status(201).json({ message: 'Report created successfully' })
        }
        else {
            response.status(500).json({ message: 'Failed to create report' })
        }
    }
}