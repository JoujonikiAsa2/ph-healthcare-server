import express from 'express'
import { AuthControllers } from './auth.controller'
import { UserRole } from '../../../../generated/prisma'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post('/login',AuthControllers.loginUser)

router.post('/refresh-token',AuthControllers.refreshToken)

router.post('/change-password', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), AuthControllers.changePassword)

router.post('/forget-password', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), AuthControllers.forgetPassword)

router.post('/reset-password', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), AuthControllers.resetPassword)

export const AuthRoutes = router