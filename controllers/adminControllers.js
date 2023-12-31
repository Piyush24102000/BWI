const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const { uploadToAws } = require("../utils/awsUpload")
const { adminSignup } = require("../utils/adminSignup")

const createAdmin = async (req, res) => {
    try {
        /* --------------Validations------------- */
        const { name, email, password, phoneNumber } = req.body
        const profileImage = req.file

        /* Authorization */
        let payload = req.cookies.payload
        if (payload.role !== 'Admin') {
            return res.status(403).json({ status: false, message: "Sorry you are unauthorized user" })
        }

        const validationError = await adminSignup(req.body, res, name, email, password, phoneNumber, profileImage);
        if (validationError) {
            return validationError;
        }

        let location = await uploadToAws(profileImage)

        /* --------------Business Logic-------------- */
        let hashedPassword = await bcrypt.hash(password, 5)
        let createUser = await userModel.create({ name, email, password: hashedPassword, phoneNumber, profileImage: location, role: "Admin" })
        return res.status(201).json({ status: true, message: "Admin created successfully", data: createUser })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = { createAdmin }