const { S3 } = require('aws-sdk')

/* --------------AWS Details----------------- */
async function uploadToAws(profileImage) {
    
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

    try {
        const uploadResult = await s3.upload(uploadParams).promise();
        const location = uploadResult.Location;
        return location
    } catch (uploadError) {
        return res.status(500).json({ status: false, message: "Error uploading profile image to AWS S3.", error: uploadError.message });
    }
}

module.exports = { uploadToAws }