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

        router.get('/reports/:id', [reportsController, 'show'])

        router.put('/reports/:id', [reportsController, 'update'])

        router.get('/my-reports', [reportsController, 'getMyReports'])

    }).use(middleware.auth({ guards: ['api'] }))
}).prefix('/api')

