import express from 'express'
import cors from 'cors'
import path from 'path'
import { router } from './routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())

app.use(router)
app.use(
    '/files',express.static(path.resolve(__dirname,"..",'tmp'))
)

app.use(errorHandler)

export { app }