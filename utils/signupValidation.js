const userModel = require("../models/userModel")
const { signupJoiValidation } = require("../validations/userValidation")

const signupValidation = async (req, res, name, email, password, phoneNumber, profileImage) => {

    if (!email && !phoneNumber) {
        return res.status(400).json({ status: false, message: "Please provide email/phoneNumber or both" })
    }
    if (!name || !password) {
        return res.status(400).json({ status: false, message: "Please provide name and password " })
    }
    if (!profileImage) {
        return res.status(400).json({ status: false, message: "Please provide Profile Image" })
    }

    /* --------------Joi Validation---------- */
    const { error } = signupJoiValidation(req);
    if (error) {
        return res.status(400).json({ status: false, message: error.details[0].message });
    }
    
    let checkIfEmailExists = await userModel.findOne({ email })
    if (checkIfEmailExists) {
        return res.status(400).json({ status: false, message: "Email already exists" })
    }
    let checkIfPhoneExists = await userModel.findOne({ phoneNumber })
    if (checkIfPhoneExists) {
        return res.status(400).json({ status: false, message: "Phone Number already exists" })
    }

    // Validation passed
    return null;
}
module.exports = { signupValidation }