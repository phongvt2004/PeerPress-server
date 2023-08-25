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
    
    static update = async(data) => {
        const press = await Press.findOneAndUpdate({slug: data.slug},data)
        if(press) {
            return press
        } else {
            return createError.InternalServerError("Cannot update press")
        }
    }

    static getByType = async({type}) => {
        const press = await Press.find({type})
        if(press) return press
        else return createError.NotFound("Type not found")
    }

    static getBySlug = async({slug}) => {
        const press = await Press.find({slug})
        if(press) return press
        else return createError.NotFound("Slug not found")
    }
}

module.exports = PressService