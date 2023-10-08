const Email = require('../models/email.model')
const createError = require('../utils/create-error')

class EmailService {
    static add = async({address}) => {
        try {
            let email = await Email.find().sort({_id: -1}).limit(1)
            let result
            if(email.length === 0 || email.amount >=20) {
                email = new Email({
                    list: [address],
                    amount: 1,
                })
                result = await email.save()
            } else {
                email = email[0]
                email.list.push(address)
                email.amount = email.list.length
                result = await Email.updateOne({_id: email._id}, email)
            }
            return result
        } catch (error) {
            console.log(error)
            return createError.InternalServerError(error)
        }
    }
}

module.exports = EmailService