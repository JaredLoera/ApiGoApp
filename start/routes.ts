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
const pushNotificationService = () => import('#controllers/notification_pushes_controller')



router.group(() => {
    router.post('/users', [userController, 'create'])
    
    
    router.post('/login', [sessionController, 'login'])


    router.post('/2fa/verify', [sessionController, 'loginWithCode'])

    router.get('verify-email/:email', [userController, 'verifyEmail']).as('verifyemail')

    router.group(() => {


        router.post('/subscribe', [pushNotificationService, 'subscribe'])
        //eventos 
        router.post('/report-events', [reportsController, 'createReportEvent'])

        //REPORTES 
        router.get('/report-types', [reportsController, 'reportTypes'])

        router.get('/report-status', [reportsController, 'reportStatus'])

        router.post('/reports', [reportsController, 'store'])

        router.get('/reports', [reportsController, 'index'])

        router.post('/logout', [sessionController, 'destroy'])

        router.get('/reports/:id', [reportsController, 'show'])

        router.put('/reports/:id', [reportsController, 'update'])

        router.get('/my-reports', [reportsController, 'getMyReports'])

        router.get('/reportsfinishedpending', [reportsController, 'getAllReportsDifferentByPending'])

        router.get('/profile', [userController, 'myProfile'])

        router .delete('/users/:id', [userController, 'deleteUser'])
        router.post('/admin/users', [userController, 'createAdmin'])
        router.get('/admin/users', [userController, 'GetUsersAdmin'])
        router.put('/users/:id', [userController, 'updateUser'])     

    }).use(middleware.auth({ guards: ['api'] }))
}).prefix('/api')

