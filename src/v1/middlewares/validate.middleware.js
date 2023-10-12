const {authVal, emailVal} = require('../utils/validate')

async function authValidate(req, res, next) {
    try {
        await authVal.validateAsync(req.body)
        next()
    } catch (err) {
        res.json({
            status: 400,
            error: err
        })
    }
}

async function EmailValidate(req, res, next) {
    try {
        await emailVal.validateAsync(req.body?.address)
        next()
    } catch (err) {
        res.json({
            code: 400,
            error: err
        })
    }
}

module.exports = {
    authValidate,
    EmailValidate
}