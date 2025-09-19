/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const userController = () => import('#controllers/users_controller')
const sessionController = () => import('#controllers/session_controller')



router.group(() => {
router.post('/users', [userController, 'create'])
router.post('/login', [sessionController, 'store'])
router.post('/logout', [sessionController, 'destroy']).use(middleware.auth({ guards: ['api'] }))
}).prefix('/api')

