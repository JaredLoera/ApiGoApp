import type { HttpContext } from '@adonisjs/core/http'
import { UserValidator } from '#validators/user'
import User from '#models/user'

export default class UsersController {
    public async create({ request, response }: HttpContext) {
        const data = request.all()
        const validatedData = await UserValidator.validate(data)
        if(await User.findBy('email', validatedData.email)) {
            return response.status(400).json({ message: 'Email already exists' })
        }
        if(await User.create(validatedData)){
            response.status(201).json({ message: 'User created successfully' })
        }
        else {
            response.status(500).json({ message: 'Failed to create user' })
        }
    }
}