const Writer = require('../models/writer.model')
const saltRounds = 10;
const createError = require('http-errors')
const bcrypt = require('bcrypt')

class WriterService {
    static create = async({
        username,
        password
    }) => {
        try {
            const user = await Writer.find({ username})
            if (user) {
                return {
                    status: 400,
                    message: "Username already created"
                }
            }
            const hash = await bcrypt.hash(password, saltRounds)
            await Writer.create({
                username,
                type,
                password: hash
            })
            const result = await Writer.findOne({username})
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static login = async({
        username,
        password
    }) => {
        const writer = await Writer.findOne({username})
        if(writer) {
            const result = await bcrypt.compare(password, writer.password)
            if(result) {
                return writer
            } else {
                return createError.Unauthorized("Wrong password")
            }
        }
    }
}

module.exports = WriterService