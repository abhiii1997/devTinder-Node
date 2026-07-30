const validator = require("validator")

const validateSignup = (req) => {
    const { firstName, lastName, emailId, password } = req.body

    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("Please enter required fields")
    }

    const isValidEmail = validator.isEmail(emailId)
    if (!isValidEmail) {
        throw new Error("Please enter a valid email address")
    }

    const isStrongPassword = validator.isStrongPassword(password)
    if (!isStrongPassword) {
        throw new Error("Please enter a strong password")
    }
}

const validateProfileData = (req) => {
    const allowedUpdateValues = ["firstName", "lastName", "photoUrl", "about"]

    const userData = req.body
    const isEditAllowed = Object.keys(userData).every((ele)=> allowedUpdateValues.includes(ele))
    return isEditAllowed

}

module.exports = {validateSignup, validateProfileData}