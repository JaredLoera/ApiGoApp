import type { HttpContext } from '@adonisjs/core/http'
import { UserValidator } from '#validators/user'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'

export default class UsersController {

    public async GetUsersAdmin ({ response }: HttpContext) {
        const admins = await User.GetUsersAdmin()
        return response.status(200).json(admins)
    }
    public async create({ request, response }: HttpContext) {
        const data = request.all()
        const validatedData = await UserValidator.validate(data)
        if(await User.findBy('email', validatedData.email)) {
            return response.status(400).json({ message: 'Email already exists' })
        }
        if(await User.create(validatedData)){
              
            await mail.send((message) => {
                message
                  .from('ecoreporte@updates.buenasnochis.online')
                    .to(validatedData.email)
                    .subject('Welcome to GoApp!')
                    .htmlView('emails/verify_email_html', { fullName: validatedData.full_name || 'User' })
              });

            response.status(201).json({ message: 'User created successfully' })

        }
        else {
            response.status(500).json({ message: 'Failed to create user' })
        }
    }
    public async myProfile({ auth, response }: HttpContext) {
        const user = auth.user
        if (user) {
            response.status(200).json(user)
        } else {
            response.status(404).json({ message: 'User not found' })
        }
    }
    public async createAdmin({ request, response }: HttpContext) {
        const data = request.all()
        const validatedData = await UserValidator.validate(data)
        validatedData.role_id = 1
        if(await User.findBy('email', validatedData.email)) {
            return response.status(400).json({ message: 'Email already exists' })
        }
        if(await User.create(validatedData)){
            response.status(201).json({ message: 'Admin user created successfully' })
        }
        else {
            response.status(500).json({ message: 'Failed to create admin user' })
        }
    }

    public async deleteUser({ params, response }: HttpContext) {
        const userId = params.id
        const user = await User.find(userId)
        if (user) {
            await user.delete()
            response.status(200).json({ message: 'User deleted successfully' })
        } else {
            response.status(404).json({ message: 'User not found' })
        }
    }

    public async updateUser({ params, request, response }: HttpContext) {
        const userId = params.id
        const user = await User.find(userId)
        if (user) {
            const data = request.all()
            const validatedData = await UserValidator.validate(data)
            user.merge(validatedData)
            await user.save()
            response.status(200).json({ message: 'User updated successfully', user })
        } else {
            response.status(404).json({ message: 'User not found' })
        }       
    }
}