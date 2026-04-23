import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/auth.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app