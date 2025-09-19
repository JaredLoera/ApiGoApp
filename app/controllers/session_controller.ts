import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
export default class SessionController {
    async store({ request, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])
        const user = await User.findBy('email', email)
        if (!user) {
            return response.status(400).json({ message: 'Invalid email or password' })
        }
        if (!(await hash.verify(user.password, password))) {
            return response.status(400).json({ message: 'Invalid email or password' })
        }
        const token = await User.accessTokens.create(user)

        return response.status(200).json(
            {
                type: 'bearer',
                token: token.value!.release()
            }
        )
    }
    async destroy({ auth }: HttpContext) {
        await auth.use('api').invalidateToken()
    }
}