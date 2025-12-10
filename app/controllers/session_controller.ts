import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import AuthCode from '#models/auth_code'
import mail from '@adonisjs/mail/services/main'

export default class SessionController {


    async login({ request, response }: HttpContext) {
        try {
            // 1. Verificar credenciales (usando el proveedor de autenticación de Adonis)
            const { email, password } = request.only(['email', 'password'])
            const user = await User.findBy('email', email)
            if (!user) {
                return response.status(400).json({ message: 'Invalid email or password' })
            }
            if (!(await hash.verify(user.password, password))) {
                return response.status(400).json({ message: 'Invalid email or password' })
            }

            // 2. Generar un código temporal de 6 dígitos
            const code = Math.floor(100000 + Math.random() * 900000).toString()

            // 3. Guardar el código en la base de datos (modelo AuthCode)
            // (Asegúrate de guardar el user_id, el código, y el tiempo de expiración)
            await AuthCode.create({
                user_id: user.id,
                code: code,
                expires_at: new Date(Date.now() + 10 * 60000) // Expira en 10 minutos
            })

            await mail.send((message) => {
                message
                    .from('ecoreporte@updates.buenasnochis.online')
                    .to(user.email)
                    .subject('Welcome to GoApp!')
                    .htmlView('emails/verify_code_html.edge', { fullName: user.full_name || 'User', code: code })
            });

            // 5. Devolver una respuesta indicando que se requiere el 2FA.
            return response.status(202).json({
                message: 'Code sent. Verification required.',
                requiresTwoFactor: true,
                // Opcional: una clave temporal para referenciar la sesión
            })

        } catch (error) {
            return response.status(401).json({ message: 'Invalid credentials' })
        }
    }


    async loginWithCode({ request, response }: HttpContext) {
        const { email, code } = request.only(['email', 'code'])
        const user = await User.findBy('email', email)
        if (!user) {
            return response.status(400).json({ message: 'Invalid email or code' })
        }
        const authCode = await AuthCode.query()
            .where('user_id', user.id)
            .andWhere('code', code)
            .andWhere('used', false)
            .andWhere('expires_at', '>', new Date())
            .first()
        if (!authCode) {
            return response.status(400).json({ message: 'El código ha expirado' })
        }
        // Marcar el código como usado
        authCode.used = true
        await authCode.save()

        // Aquí puedes generar un token de acceso o iniciar sesión para el usuario
        const token = await User.accessTokens.create(user)

        return response.status(200).json(
            {
                type: 'bearer',
                token: token.value!.release()
            }
        )
    }

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