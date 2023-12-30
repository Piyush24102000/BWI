const express = require('express')
const userRoutes = express.Router()
const multer = require('multer');
const upload = multer()
const { userSignup, userLogin, userUpdate, userDelete, userView } = require('../controllers/userControllers');
const { userAuth } = require('../middlewares/authentication');

/* ---------------Routes-------------- */
userRoutes.post('/signup', upload.single('file'), userSignup)
userRoutes.post('/login', userLogin)
userRoutes.get('/view/:userId', userAuth, userView)
userRoutes.put('/update/:userId', upload.single('file'), userAuth, userUpdate)
userRoutes.delete('/delete/:userId', userAuth, userDelete)

module.exports = { userRoutes }