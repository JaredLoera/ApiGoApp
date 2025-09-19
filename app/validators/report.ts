import vine from '@vinejs/vine'


export const reportValidator = vine.compile(
    vine.object({
        user_id: vine.number(),
        report_type_id: vine.number(),
        report_status_id: vine.number(),
        description: vine.string().minLength(10).maxLength(500),
        latitude: vine.string(),
        longitude: vine.string()
    })
)