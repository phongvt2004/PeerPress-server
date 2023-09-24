const writerService = require('../services/writer.service')
const {
    signAccessToken,
    signRefreshToken,
} = require('../utils/jwt')

class WriterController {
    async create(req, res, next) {
        try {
            const{
                username,
                type,
                password
            } = req.body
            const data = await writerService.create({
                username,
                type,
                password
            })
            if (data?.status === 400) {
                console.log("err")
                res.json(data)
            } else {
                const accessToken = await signAccessToken(data._id.toString())
                console.log(data)
                const refreshToken = await signRefreshToken(data._id.toString())
                res.cookie('access-token', accessToken)
                res.cookie('type', type)
                res.json({
                    status: 201,
                    refreshToken,
                    data
                })
            }
        } catch (error) {
            console.log('error')
            res.json(error)
        }
    }

    async login(req, res, next) {
        const {
            username,
            password,
        } = req.body
        const data = await writerService.login({
            username,
            password,
        })
        if(data?.status === 401) {
            res.json(data)
        } else {
            const accessToken = await signAccessToken(data._id.toString())
            const refreshToken = await signRefreshToken(data._id.toString())
            res.cookie('access-token', accessToken,  { maxAge: 900000, httpOnly: true })
            res.cookie('type', data.type)
            res.json({
                status: 200,
                refreshToken,
                data
            })
        }
        
    }
}

module.exports = new WriterController()