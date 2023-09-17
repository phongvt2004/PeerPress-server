const PressService = require('../services/press.service')
const createError = require('http-errors')

class PressController {
    async create(req, res, next) {
        try {
            const{
                heading,
                type,
                preview,
                thumbnail,
                content,
                writer
            } = req.body
            const today = new Date()
            let date = {
                week: today.getWeek(),
                month : today.getMonth(),
                year : today.getFullYear()
            }
            const data = await PressService.create({
                heading,
                type: type.toUpperCase(),
                preview,
                thumbnail,
                content,
                date: date,
                views :0, 
                writer: writer? writer:'admin'
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
    }

    async get(req, res, next) {
        try {      
            const {
                pressId
            } = req.query

            const data = await PressService.get({
                pressId
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
        
    }

    async update(req, res, next) {
        try {
            const{
                writerheading,
                type,
                preview,
                content,
                writer,
                slug
            } = req.body

            const data = await PressService.update({
                writerheading,
                type,
                preview,
                content,
                writer,
                slug
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
    }

    async updateData(req, res, next) {
        try {
            if(req.body?.token === "This is update token") {
                const data = await PressService.updateData()
                res.json(data)
            } else {
                res.json(createError.Forbidden("Wrong token"))
            }
        } catch (error) {
            res.json(createError.InternalServerError(error))
        }
    }

    async getByTypeNumber(req, res, next) {
        try {
            const {
                type,
                number
            } = req.query
            const data = await PressService.getByTypeNumber({
                type,
                number
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
    }
    async getByType(req, res, next) {
        try {
            const {
                type,
                load
            } = req.query

            const data = await PressService.getByType({
                type,
                load: load ? load : 1
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
    }
    async getBySlug(req, res, next) {
        try {
            const {
                slug
            } = req.query

            const data = await PressService.getBySlug({
                slug
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
    }

    async getNewPost(req, res, next) {
        try {
            const {
                number
            } = req.query
            const data = await PressService.getNewPost({
                number
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
    }

    async getPopularPost(req, res, next) {
        try {
            const {
               number 
            } = req.query
            const data = await PressService.getPopularPost({number})
            res.json(data)
        } catch (error) {
            res.json(createError.InternalServerError(error))
        }
    }

    async searchPress(req, res, next) {
        try {
            const {
                keyword,
                type,
                load
            } = req.query
            const data = await PressService.searchPress({
                keyword,
                type,
                load
            })

            res.json(data)
        } catch (error) {
            console.log(error)
            next(createError.InternalServerError(error))
        }
    }

    async deletePress(req, res, next) {
        try {
            const {
                pressId
            } = req.query
            const data = await PressService.deletePress({pressId})
            res.json(data)
        } catch (error) {
            res.json(createError.InternalServerError(error))
        }
    }
}

module.exports = new PressController()