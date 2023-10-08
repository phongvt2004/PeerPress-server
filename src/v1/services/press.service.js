const Press = require('../models/press.model')
const createError = require('../utils/create-error')

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

    static updateData = async () => {
        const presses = await Press.find()
        for(let press of presses) {
            press.views = 0;
            let date = new Date(press.createdAt);
            press.date = {
                week: date.getWeek(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            }
            await Press.updateOne({_id: press._id}, press)
        }
        return "ok"
    }

    static getByTypeNumber = async({type, number}) => {
        const press = await Press.aggregate([{
            $match: {type: type},
        },
        {
            $sort: {_id: -1}
        },
        {
            $limit: number
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
            $match: {type: type},
        },
        {
            $sort: {_id: -1}
        },
        {
            $skip: perLoad*load-perLoad
        },
        {
            $limit: perLoad
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
        const press = await Press.findOne({slug})
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
            $sort: {_id: -1}
        },
        {
            $limit: Number(number)
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
                $sort: {views: -1}
            },
            {
                $limit: Number(number)
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

    static searchPress = async({keyword, type, load}) => {
        const perLoad = 10
        const press =type ? await Press.aggregate([
            {
                $match: {
                    type: type,
                    heading: {$regex: new RegExp(`.*${keyword}.*`,'igm')}
                }
            },
            {
                $sort: {_id: -1}
            },
            {
                $skip: perLoad*load-perLoad
            },
            {
                $limit: perLoad
            },
            {
                $project: {
                    _id: 0,
                    date: 0,
                }
            }
        ]) : await Press.aggregate([
            {
                $match: {
                    heading: {$regex: new RegExp(`.*${keyword}.*`,'igm')}
                }
            },
            {
                $sort: {_id: -1}
            },
            {
                $skip: perLoad*load-perLoad
            },
            {
                $limit: perLoad
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

    async deletePress({pressId}) {
        let press = await Press.deleteOne({_id: pressId})
        return press
    }
}

module.exports = PressService