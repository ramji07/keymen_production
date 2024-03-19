import express from 'express'
import dotenv from 'dotenv'
import Connection from './config/db.Connection.js'
import Routes from './Routes/user.Routes.js'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors({
  origin: ['https://keymenadvisory.com']
}))


// Set up the static files serving for the client build directory
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, './client/build')))

// Define routes
app.use('/api', Routes)

// Serve index.html for all other routes (React Router)
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './client/build', 'index.html'))
})

Connection()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
