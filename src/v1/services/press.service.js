const Press = require('../models/press.model')
const createError = require('../utils/create-error')
const published = 0;
const pending = 1;
const deleted = 2;

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

    static getByState = async({
        state,
        load,
        perLoad
    }) => {
        const presses = await Press.aggregate([{
            $match: {
                state: state
            },
        },
        {
            $limit: Number.parseInt(perLoad*(load-1)) + Number.parseInt(perLoad)
        },
        {
            $skip: Number.parseInt(perLoad*(load-1))
        },])
        const length = await Press.countDocuments({ state: state})
        if(presses.length > 0) {
            return {presses, length}
        } else {
            return createError.NotFound("Press not found")
        }
    }

    static publishPress = async({pressId}) => {
        const press = await Press.findOneAndUpdate({_id: pressId}, {state: published}, {
            new: true,
        })
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

    static updateData = async () => {
        const presses = await Press.find()
        let i = 0
        for(let press of presses) {
            press.state = i % 3 === 0 ? pending : published
            i++
            press.userId = "6507da0e240b942c49543bce"
            await Press.updateOne({_id: press._id}, press)
        }
        return "ok"
    }

    static getByTypeNumber = async({type, number}) => {
        const press = await Press.aggregate([{
            $match: {
                state: published,
                type: type,
            },
        },
        {
            $sort: {_id: -1}
        },
        {
            $limit: Number.parseInt(number)
        },
        {
            $project: {
                _id: 0,
                date: 0,
            }
        }])
        if(press.length>0) return press
        else return createError.NotFound("Type not found")
    }

    static getByType = async({type, load}) => {
        const perLoad = 5
        const press = await Press.aggregate([{
            $match: {
                state: published,
                type: type
            },
        },
        {
            $sort: {_id: -1}
        },
        {
            $limit: Number.parseInt(perLoad*(load-1)) + Number.parseInt(perLoad)
        },
        {
            $skip: Number.parseInt(perLoad*(load-1))
        },
        {
            $project: {
                _id: 0,
                date: 0,
            }
        }])
        if(press.length>0) return press
        else return createError.NotFound("Type not found")
    }

    static getBySlug = async({slug}) => {
        const press = await Press.findOne({slug, state: published})
        press.views++
        await Press.updateOne({_id: press._id}, press)
        if(press) return {
            preview: press.preview,
            content: press.content,
            thumbnail: press.thumbnail,
            type: press.type,
            heading: press.heading,
        }
        else return createError.NotFound("Slug not found")
    }

    static getNewPost = async({number}) => {
        console.log("-------------")
        const press = await Press.aggregate([
        {
            $match: {
                state: published,
            }
        },
        {
            $sort: {_id: -1}
        },
        {
            $limit: Number.parseInt(number)
        },
        {
            $project: {
                _id: 0,
                date: 0,
            }
        }])
        console.log(press)
        if(press.length>0) return press
        else return createError.NotFound("Not found any press")
    }

    static getPopularPost = async({number}) => {
        const press = await Press.aggregate([
            {
                $match: {
                    state: published,
                }
            },
            {
                $sort: {views: -1}
            },
            {
                $limit: Number.parseInt(number)
            },
            {
                $project: {
                    _id: 0,
                    date: 0,
                }
            }
        ])
        if(press.length>0) return press
        else return createError.NotFound("Not found any press")
    }

    static searchPress = async({keyword, type, load, perLoad, date}) => {

        let match = {
            state: published,
            heading: {$regex: new RegExp(`.*${keyword}.*`,'igm')}
        }

        if(type) match.type = type.toUpperCase()
        if(date) {
            date = Number.parseInt(date)
            const now = new Date()
            match.date = {}
            if(date === 0) match.date.week = now.getWeek()-1
            else if(date === 1) match.date.month = now.getMonth()-1
            if(date === 2) match.date.year = now.getFullYear()-1
        }

        const press = await Press.aggregate([
            {
                $match: match
            },
            {
                $sort: {_id: -1}
            },
            {
                $limit: Number.parseInt(perLoad*(load-1)) + Number.parseInt(perLoad)
            },
            {
                $skip: Number.parseInt(perLoad*(load-1))
            },
            {
                $project: {
                    _id: 0,
                    date: 0,
                }
            }
        ])
        console.log(press)
        if(press.length>0) return press
        else return createError.NotFound("Not found any press")
    }

    static deletePress = async({pressId}) => {
        let press = await Press.findByIdAndUpdate({_id: pressId}, {
            state: deleted
        }, {
            new: true
        })
        return press
    }

    static deleteForerver = async({pressId}) => {
        let press = await Press.deleteOne({_id: pressId})
        return press
    }
}

module.exports = PressService