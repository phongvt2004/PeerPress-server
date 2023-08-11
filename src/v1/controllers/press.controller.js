const PressService = require('../services/press.service')

class PressController {
    async create(req, res, next) {
        try {
            const{
                writerheading,
                type,
                preview,
                content,
                writer
            } = req.body
            
            const data = await PressService.create({
                writerheading,
                type,
                preview,
                content,
                writer: writer? writer:'admin'
            })

            res.json(data)
        } catch (error) {
            res.json(error)
        }
    }

    async get(req, res, next) {
        try {      
            const {
                pressId
            } = req.body

            const data = await PressService.get({
                pressId
            })

            res.json(data)
        } catch (error) {
            res.json(error)
        }
        
    }
}

module.exports = new PressController()