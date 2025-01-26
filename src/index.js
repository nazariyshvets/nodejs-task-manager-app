import express from 'express'
import 'dotenv/config.js'
import './db/mongoose.js'
import userRouter from './routers/user.js'
import taskRouter from './routers/task.js'

const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`)
})