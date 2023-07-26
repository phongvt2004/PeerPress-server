const Press = require('../models/press.model')
const createError = require('http-errors')

class PressService {
    static create = async(data) => {
        try {
            const press = new Press(data)
            const result = await press.save()
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static get = async({
        pressId
    }) => {
        const press = await Press.findById(pressId)
        if(press) {
            return press
        } else {
            return createError.NotFound("Press not found")
        }
    }
}

module.exports = PressService