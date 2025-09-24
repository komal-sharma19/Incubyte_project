const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const sweetsRoutes = require('./routes/sweets')
const cookieParser = require('cookie-parser')

dotenv.config()
connectDB()

const app = express()

// Middleware
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/sweets', sweetsRoutes)

// Error handler (optional, can extend)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

module.exports = app;

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  );
}
