const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const { S3 } = require('aws-sdk')

const createAdmin = async (req, res) => {
    try {
        /* --------------Validations------------- */
        /* Authorization */
        let payload = req.cookies.payload
        if (payload.role !== 'Admin') {
            return res.status(403).json({ status: false, message: "Sorry you are unauthorized user" })
        }
        const { name, email, password, phoneNumber } = req.body
        const profileImage = req.file
        if(!profileImage){
            return res.status(400).json({status:false,message:"Please provide profile image"})
        }
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
        let createUser = await userModel.create({ name, email, password: hashedPassword, phoneNumber, profileImage: location, role: "Admin" })
        return res.status(201).json({ status: true, message: "Admin created successfully", data: createUser })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = { createAdmin }