const Joi = require('joi');

const authVal = Joi.object({
    fullname: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/, 'numbers').required(),
})

const emailVal = Joi.string().email().required()

module.exports = {
    authVal,
    emailVal,
}