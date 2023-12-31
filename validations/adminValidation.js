const Joi = require('joi');

const adminJoiValidation = (data) => {

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
module.exports = { adminJoiValidation }