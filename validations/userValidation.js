const Joi = require('joi');

function signupJoiValidation(data) {
    const schema = Joi.object({
        name: Joi.string().trim().required().regex(/^[a-zA-Z ]+$/).message("Name should contain only English letters"),
        phoneNumber: Joi.string().trim().regex(/^[0]?[6789]\d{9}$/).message("Phone Number is not valid"),
        email: Joi.string().trim().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).message("Give proper email"),
        password: Joi.string()
            .trim()
            .required()
            .min(6)
            .max(15)
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&*!]+$/)
            .message("Password should contain at least a number and minimum length of 6"),
    })
    return schema.validate(data)
}

function loginJoiValidation(data) {
    let { email, password, phoneNumber } = data
    const schema = Joi.object({
        email: Joi.string().trim().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).message("Give proper email"),
        phoneNumber: Joi.string().trim().regex(/^[0]?[6789]\d{9}$/).message("Phone Number is not valid"),
        password: Joi.string()
            .trim()
            .required()
            .min(6)
            .max(15)
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&*!]+$/)
            .message("Password should contain at least a number and minimum length of 6"),
    })
    return schema.validate({ email, password, phoneNumber })
}

function updateJoiValidation(data) {
    const schema = Joi.object({
        name: Joi.string().trim().regex(/^[a-zA-Z ]+$/).message("Name should contain only English letters")
    })
    return schema.validate(data)
}

module.exports = { signupJoiValidation, loginJoiValidation, updateJoiValidation }