import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma.js'

const generateTokens = (userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  )
  return { token, refreshToken }
}

const safeUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
})

export const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, password: hashed, role: role || 'STUDENT' }
    })

    const { token, refreshToken } = generateTokens(user.id)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    })

    res.status(201).json({
      message: 'Account created successfully',
      user: safeUser(user),
      token,
      refreshToken,
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const { token, refreshToken } = generateTokens(user.id)
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    })

    res.json({
      message: 'Login successful',
      user: safeUser(user),
      token,
      refreshToken,
    })
  } catch (err) {
    next(err)
  }
}

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: incomingRefresh } = req.body
    if (!incomingRefresh) {
      return res.status(401).json({ message: 'Refresh token required' })
    }

    const decoded = jwt.verify(incomingRefresh, process.env.JWT_REFRESH_SECRET)
    const user = await prisma.user.findFirst({
      where: { id: decoded.userId, refreshToken: incomingRefresh },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const { token, refreshToken: newRefresh } = generateTokens(user.id)
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefresh },
    })

    res.json({ token, refreshToken: newRefresh })
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired or invalid' })
    }
    next(err)
  }
}

export const logout = async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    })
    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        studentProfile: true,
        companyProfile: true,
      },
    })
    res.json({ user: safeUser(user), profile: user.studentProfile || user.companyProfile })
  } catch (err) {
    next(err)
  }
}