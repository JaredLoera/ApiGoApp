import vine from '@vinejs/vine'

export const UserValidator = vine.compile(
    vine.object({
        full_name: vine.string().minLength(3).maxLength(255),
        email: vine.string().email(),
        password: vine.string().minLength(8).maxLength(255),
        role_id: vine.number().min(1).max(2).optional(),
    })
)