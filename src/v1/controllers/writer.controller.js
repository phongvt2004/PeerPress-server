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
                password
            } = req.body
            const data = await writerService.create({
                username,
                password
            })
            if (data?.status === 400) {
                res.json(data)
            } else {
                const accessToken = await signAccessToken(data._id.toString())
                const refreshToken = await signRefreshToken(data._id.toString())
                res.json({
                    status: 201,
                    accessToken,
                    refreshToken,
                    data
                })
            }
        } catch (error) {
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
            res.json({
                status: 200,
                accessToken,
                refreshToken,
                data
            })
        }
        
    }
}

module.exports = new WriterController()