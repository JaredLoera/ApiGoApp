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
const reportsController = () => import('#controllers/reports_controller')



router.group(() => {
    router.post('/users', [userController, 'create'])
    router.post('/login', [sessionController, 'store'])


    router.group(() => {
        //REPORTES 
        router.get('/report-types', [reportsController, 'reportTypes'])

        router.get('/report-status', [reportsController, 'reportStatus'])

        router.post('/reports', [reportsController, 'store'])

        router.get('/reports', [reportsController, 'index'])

        router.post('/logout', [sessionController, 'destroy'])
    }).use(middleware.auth({ guards: ['api'] }))
}).prefix('/api')

