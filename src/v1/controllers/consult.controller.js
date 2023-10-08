const ConsultService = require('../services/consult.service')
const createError = require('../utils/create-error')

class ConsultController {
    async create(req, res, next) {
        try {
            let {
                name,
                school,
                grade,
                phoneNumber,
                budget,
            } = req.body
            grade = grade.split(' ').join('').split(',').join('').split('.').join('')
            const data = await ConsultService.create({
                name,
                school,
                grade : Number.parseInt(grade),
                phoneNumber,
                budget: Number.parseInt(budget),
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
    }

    async get(req, res, next) {
        try {      
            const {
                consultId
            } = req.query

            const data = await ConsultService.get({
                consultId
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
        
    }

    
    async getList(req, res, next) {
        try {
            const {
                load,
                perload
            } = req.query

            const data = await ConsultService.getList({
                load: load ? load : 1,
                perload: perload ? perload : 5,
            })

            res.json(data)
        } catch (error) {
            next(createError.InternalServerError(error))
        }
    }
    
}

module.exports = new ConsultController()