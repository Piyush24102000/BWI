const express = require('express')
const adminRoutes = express.Router()
const { userAuth } = require('../middlewares/authentication')
const { createAdmin } = require('../controllers/adminControllers')
const multer = require('multer');
const upload = multer()

/* ---------------Routes-------------- */
adminRoutes.post('/create-admin', upload.single('file'), userAuth, createAdmin)

module.exports = { adminRoutes }