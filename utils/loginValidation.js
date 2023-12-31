const { loginJoiValidation } = require("../validations/userValidation")

const loginValidation = async (res, email, password, phoneNumber) => {

    if (!email && !phoneNumber) {
        return res.status(400).json({ status: false, message: "Please provide email or phoneNumber" })
    }
    if (!password) {
        return res.status(400).json({ status: false, message: "Please provide password" })
    }

    /* --------------Joi Validation---------- */
    const { error } = loginJoiValidation({ email, password, phoneNumber });
    if (error) {
        return res.status(400).json({ status: false, message: error.details[0].message });
    }
    return null

}

module.exports = { loginValidation }