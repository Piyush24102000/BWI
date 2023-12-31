const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { uploadToAws } = require("../utils/awsUpload")
const { signupValidation } = require("../utils/signupValidation")
const { loginValidation } = require("../utils/loginValidation")
const { updateValidation } = require("../utils/updateValidation")

const userSignup = async (req, res) => {
    try {
        /* --------------Validations----------------- */
        const { name, email, password, phoneNumber } = req.body
        const profileImage = req.file

        const validationError = await signupValidation(req.body, res, name, email, password, phoneNumber, profileImage);
        if (validationError) {
            return validationError;
        }
        let location = await uploadToAws(profileImage)

        /* --------------Business Logic-------------- */
        let hashedPassword = await bcrypt.hash(password, 5)
        let createUser = await userModel.create({ name, email, password: hashedPassword, phoneNumber, profileImage: location })
        return res.status(201).json({ status: true, message: "User signed up successfully", data: createUser })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal server error.", error: error.message });
    }
}

const userLogin = async (req, res) => {
    try {
        /* ----------------Validations------------------ */
        let { email, phoneNumber, password } = req.body
        const validationError = await loginValidation(res, email, password, phoneNumber)
        if (validationError) {
            return validationError
        }
        /* ----------------Business Logic--------------- */

        //Check for email and phonenumber
        let checkUserExistsEmail, checkUserExistsPhone;

        if (email && phoneNumber) {
            checkUserExistsEmail = await userModel.findOne({ email })
            checkUserExistsPhone = await userModel.findOne({ phoneNumber })

            if (!checkUserExistsEmail && !checkUserExistsPhone) {
                return res.status(400).json({ status: false, message: "User not present with this email or incorrect phone provided" })
            }
        } else if (email) {
            checkUserExistsEmail = await userModel.findOne({ email })
            if (!checkUserExistsEmail) {
                return res.status(400).json({ status: false, message: "User not present with this email or incorrect email provided" })
            }
        } else if (phoneNumber) {
            checkUserExistsPhone = await userModel.findOne({ phoneNumber })
            if (!checkUserExistsPhone) {
                return res.status(400).json({ status: false, message: "User not present with this phone number or incorrect number provided" })
            }
        }

        // Check for correct password
        const userToCheckPassword = checkUserExistsEmail || checkUserExistsPhone;
        if (!userToCheckPassword) {
            return res.status(400).json({ status: false, message: "User not found" });
        }
        const checkPassword = await bcrypt.compare(password, userToCheckPassword.password);
        if (!checkPassword) {
            return res.status(400).json({ status: false, message: "Password is incorrect" });
        }

        // Issue JWT and Login the user
        const token = jwt.sign({ userId: userToCheckPassword._id, role: userToCheckPassword.role }, process.env.JWT_SECRET)
        res.cookie('token', token, { httpOnly: true })

        return res.status(200).json({ status: true, message: "Login successful" });

    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

const userUpdate = async (req, res) => {
    try {
        /* -------------------Validations--------------- */
        let id = req.params.userId
        let name = req.body.name
        let profileImage = req.file

        let validationError = await updateValidation(req, res, id, name, profileImage)
        if (validationError) {
            return validationError;
        }
        let checkIfUserExists = await userModel.findById(id)
        if (!checkIfUserExists) {
            return res.status(400).json({ status: false, message: "No user found with this id" });
        }
        /* -----------------Business Logic--------------- */
        // Upload new Image 
        let location = checkIfUserExists.location
        if (profileImage) {
            location = await uploadToAws(profileImage)
        }

        let updateUser = await userModel.findByIdAndUpdate(id, { name, profileImage: location }, { new: true })
        return res.status(200).json({ status: true, message: "User Updated Successfully", data: updateUser })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const userDelete = async (req, res) => {
    try {
        /* -------------------Validations--------------- */
        let id = req.params.userId
        if (!id) {
            return res.status(400).json({ status: false, message: "User id is required to delete " })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: false, message: "Please enter correct id of mongoose" })
        }
        if (req.cookies.payload.role !== 'Admin' && id !== req.cookies.payload.userId) {
            return res.status(403).json({ status: false, message: "Sorry, you are not authorized! Please provide your own id or ensure you have admin privileges" });
        }

        /* ------------------Business Logic--------------- */
        let checkiIfUserExists = await userModel.findById(id)
        if (!checkiIfUserExists) {
            return res.status(400).json({ status: false, message: "No user found with this id" });
        }

        let deleteUser = await userModel.deleteOne({ _id: id })
        return res.status(200).json({ status: true, message: "User deleted Successfully" })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const userView = async (req, res) => {
    try {
        /* ----------------Validations-------------- */
        let id = req.params.userId
        if (!id) {
            return res.status(400).json({ status: false, message: "Please provide user Id to search" })
        }
        if (req.cookies.payload.role !== 'Admin' && id !== req.cookies.payload.userId) {
            return res.status(403).json({ status: false, message: "Sorry, you are not authorized! Please provide your own id or ensure you have admin privileges" });
        }
        
        /* ----------------Business Logic-------------- */
        let getData = await userModel.findById(id)
        return res.status(200).json({ status: true, data: getData })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = { userSignup, userLogin, userUpdate, userDelete, userView }