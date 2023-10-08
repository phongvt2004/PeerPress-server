const EmailService = require('../services/email.service')
const createError = require('../utils/create-error')

class EmailController {
    async add(req, res, next) {
        try {
            let {
                address
            } = req.body
            const data = await EmailService.add({
                address
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
    }
    
}

module.exports = new EmailController()