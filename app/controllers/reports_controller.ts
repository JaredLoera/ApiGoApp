import type { HttpContext } from '@adonisjs/core/http'
import ReportType from '#models/report_type'
import ReportStatus from '#models/report_status'
import Report from '#models/report'
import { reportValidator } from '#validators/report'
import ReportPhoto from '#models/report_photo'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'


export default class ReportsController {

    public async getAllReportsDifferentByPending({ auth, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.status(401).json({ message: 'Unauthorized' })
        }
        const reports = await Report.getAllMyReportsDifferentByPending(user)
        return response.status(200).json(reports)
    }

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
        const reports = await Report.getAllReports()
        return reports
    }

    public async store({ request, response }: HttpContext) {
        const data = JSON.parse(request.body()['json']);
        const validatedData = await reportValidator.validate(data)
        const photos = request.files('photos', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg', 'gif']
        })
        const report = new Report()
        report.userId = validatedData.user_id
        report.reportTypeId = validatedData.report_type_id
        report.reportStatusId = validatedData.report_status_id
        report.description = validatedData.description
        report.latitude = validatedData.latitude
        report.longitude = validatedData.longitude
        if (await report.save()) {
            const reportPhoto = new ReportPhoto()
            for (let photo of photos) {
                await photo.move(app.makePath('uploads'), {
                    name: `${cuid()}.${photo.extname}`
                })
                    reportPhoto.url = `/uploads/${photo.fileName}`
                    reportPhoto.filename = photo.fileName!
                    reportPhoto.reportId = report.id
                    if (!(reportPhoto.save())) {
                        return response.status(500).json({ message: 'Failed to save report photo' })
                    }
            
            }
            response.status(201).json({ message: 'Report created successfully' })
        }
        else {
            response.status(500).json({ message: 'Failed to create report' })
        }
    }
    public async show({ params, response }: HttpContext) {
        const report = await Report.getReportById(params.id)
        if (report) {
            return response.status(200).json(report)
        } else {
            return response.status(404).json({ message: 'Report not found' })
        }
    }
    public async getMyReports({ auth, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.status(401).json({ message: 'Unauthorized' })
        }
        const reports = await Report.getAllActiveReports(user)
        return response.status(200).json(reports)
    }

    public async update({ params, request, response }: HttpContext) {
        const report = await Report.find(params.id)
        if (!report) {
            return response.status(404).json({ message: 'Report not found' })
        }
        const data = request.all()
        const validatedData = await reportValidator.validate(data)
        report.merge(validatedData)
        if (await report.save()) {
            return response.status(200).json({ message: 'Report updated successfully' })
        } else {
            return response.status(500).json({ message: 'Failed to update report' })
        }
    }
}