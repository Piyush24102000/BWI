const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const { S3 } = require('aws-sdk')
const jwt = require('jsonwebtoken')

const userSignup = async (req, res) => {
    try {
        /* --------------Validations----------------- */
        const { name, email, password, phoneNumber, role } = req.body
        const profileImage = req.file

        /* --------------AWS Details----------------- */
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS,
            secretAccessKey: process.env.AWS_SECRET,
        });
        const bucketName = 'buildwithinnovation';
        const objectKey = `${profileImage.originalname}`;

        // Upload the file to S3
        const uploadParams = {
            Bucket: bucketName,
            Key: objectKey,
            Body: profileImage.buffer,
            ACL: 'public-read', // Set ACL for public read access
        };

        // Upload to AWS S3
        const uploadResult = await s3.upload(uploadParams).promise();
        const location = uploadResult.Location;

        /* --------------Business Logic-------------- */

        let hashedPassword = await bcrypt.hash(password, 5)
        let createUser = await userModel.create({ name, email, password: hashedPassword, phoneNumber, profileImage: location, role })
        return res.status(201).json({ status: true, message: "User signed up successfully", data: createUser })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const userLogin = async (req, res) => {
    try {
        /* ----------------Validations------------------ */
        let { email, phoneNumber, password } = req.body
        if (!email && !phoneNumber) { return res.status(400).json({ status: false, message: "Please provide email or phoneNumber" }) }
        if (!password) { return res.status(400).json({ status: false, message: "Please provide password" }) }

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
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

const userUpdate = async (req, res) => {
    try {
        /* -------------------Validations--------------- */
        let id = req.params.userId
        let name = req.body.name
        let profileImage = req.file

        if (req.cookies.payload.role !== 'Admin' && id !== req.cookies.payload.userId) {
            return res.status(403).json({ status: false, message: "Sorry, you are not authorized! Please provide your own id or ensure you have admin privileges" });
        }
        if (!name && !profileImage) {
            return res.status(400).json({ status: false, message: "Please provide name or profileImage or both to update." });
        }
        if (req.body.email || req.body.phoneNumber) {
            return res.status(400).json({ status: false, message: "Email and phone number cannot be changed." });
        }
        let checkiIfUserExists = await userModel.findById(id)
        if (!checkiIfUserExists) {
            return res.status(400).json({ status: false, message: "No user found with this id" });
        }

        /* -----------------Business Logic--------------- */

        // Upload new Image 
        let location = checkiIfUserExists.location
        if (profileImage) {
            /* --------------AWS Details----------------- */
            const s3 = new S3({
                accessKeyId: process.env.AWS_ACCESS,
                secretAccessKey: process.env.AWS_SECRET,
            });
            const bucketName = 'buildwithinnovation';
            const objectKey = `${profileImage.originalname}`;

            // Upload the file to S3
            const uploadParams = {
                Bucket: bucketName,
                Key: objectKey,
                Body: profileImage.buffer,
                ACL: 'public-read', // Set ACL for public read access
            };
            // Upload to AWS S3
            const uploadResult = await s3.upload(uploadParams).promise();
            location = uploadResult.Location;
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