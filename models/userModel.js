const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    }
})

module.exports = mongoose.model.userModel || mongoose.model('userModel', userSchema) 