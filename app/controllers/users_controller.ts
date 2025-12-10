import type { HttpContext } from '@adonisjs/core/http'
import { UserValidator } from '#validators/user'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'

export default class UsersController {

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
}