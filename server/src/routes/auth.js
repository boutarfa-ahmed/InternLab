import { Router } from 'express'
import { register, login, refreshToken, logout, getMe } from '../controllers/authController.js'
import { authenticate } from '../middlewares/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshToken)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getMe)

export default router