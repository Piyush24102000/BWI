const mongoose = require("mongoose");
const { updateJoiValidation } = require("../validations/userValidation");

async function updateValidation(req, res, id, name, profileImage) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: false, message: "Please enter correct id of mongoose" })
    }
    if (req.cookies.payload.role !== 'Admin' && id !== req.cookies.payload.userId) {
        return res.status(403).json({ status: false, message: "Sorry, you are not authorized! Please provide your own id or ensure you have admin privileges" });
    }
    if (!name && !profileImage) {
        return res.status(400).json({ status: false, message: "Please provide name or profileImage or both to update." });
    }
    if (req.body.email || req.body.phoneNumber) {
        return res.status(400).json({ status: false, message: "Email and phone number cannot be changed." });
    }

    /* --------------Joi Validation---------- */
    const { error } = updateJoiValidation({name});
    if (error) {
        return res.status(400).json({ status: false, message: error.details[0].message });
    }

    return null
}

module.exports = { updateValidation }