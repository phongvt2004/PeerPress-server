const {authVal} = require('../utils/validate')

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

module.exports = {
    authValidate
}