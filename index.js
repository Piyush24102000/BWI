require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { userRoutes } = require('./routes/userRoutes')
const { adminRoutes } = require('./routes/adminRoutes')

/* Middlewares */
app.use(cookieParser())
app.use(express.json())

/* Routes */
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('*', (req, res) => {
    return res.status(404).json({status:false,message:'404: URL not found '});
});

/* Server and Database Connection */
mongoose.connect(process.env.MONGO_URI).then(() => { app.listen(process.env.PORT, () => { console.log("Server and Database Connected on Port 5000") }) })