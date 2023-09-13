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

    static getByTypeNumber = async({type, number}) => {
        const press = await Press.aggregate([{
            $match: {type: type},
        },
        {
            $sort: {updateAt: -1}
        },
        {
            $limit: number
        }])
        if(press.length>0) return press
        else return createError.NotFound("Type not found")
    }

    static getByType = async({type, load}) => {
        const perLoad = 5
        const press = await Press.aggregate([{
            $match: {type: type},
        },
        {
            $skip: perLoad*load-perLoad
        },
        {
            $sort: {updateAt: -1}
        },
        {
            $limit: perLoad
        }])
        if(press.length>0) return press
        else return createError.NotFound("Type not found")
    }

    static getBySlug = async({slug}) => {
        const press = await Press.findOne({slug})
        if(press) return press
        else return createError.NotFound("Slug not found")
    }

    static getNewPost = async({number}) => {
        const press = await Press.aggregate([
        {
            $sort: {updateAt: -1}
        },
        {
            $limit: number
        }])
        console.log(press)
        if(press.length>0) return press
        else return createError.NotFound("Not found any press")
    }
}

module.exports = PressService