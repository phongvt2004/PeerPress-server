const Writer = require('../models/writer.model')
const saltRounds = 10;
const createError = require('../utils/create-error')
const bcrypt = require('bcrypt')

class WriterService {
    static create = async({
        username,
        type,
        password
    }) => {
        try {
            const user = await Writer.findOne({ username})
            if (user) {
                return {
                    status: 400,
                    message: "Username already created"
                }
            }
            const hash = await bcrypt.hash(password, saltRounds)
            const User = new Writer({
                username,
                type,
                password: hash
            })
            const result = await User.save()
            console.log(result)
            return {username: result.username, type: result.type, _id: result._id}
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
                return {username: writer.username, type: writer.type, _id: writer._id}
            } else {
                return createError.Unauthorized("Wrong password")
            }
        }
    }
}

module.exports = WriterService