const Consult = require('../models/consult.model')
const createError = require('../utils/create-error')

class ConsultService {
    static create = async(data) => {
        try {
            const consult = new Consult(data)
            const result = await consult.save()
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static get = async({
        consultId
    }) => {
        const consult = await Consult.findById(consultId)
        if(consult) {
            return consult
        } else {
            return createError.NotFound("Consult not found")
        }
    }

    static getList = async({load, perLoad = 5}) => {
        const consult = await Consult.aggregate([
        {
            $sort: {_id: -1}
        },
        {
            $skip: perLoad*load-perLoad
        },
        {
            $limit: perLoad
        },
        ])
        if(consult.length>0) return consult
        else return createError.NotFound("Not found")
    }
}

module.exports = ConsultService