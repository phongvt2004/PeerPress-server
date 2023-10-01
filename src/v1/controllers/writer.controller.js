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
        try {
            const {
                username,
                password,
            } = req.body
            if(!username || !password) {
                res.json(createError.NotFound())
                return
            }
            const data = await writerService.login({
                username,
                password,
            })
            if(data?.code === 401) {
                res.json(data)
            } else {
                const agent = req.headers['user-agent']
                const accessToken = await signAccessToken(data._id.toString(), data.type, agent)
                const refreshToken = await signRefreshToken(data._id.toString(), data.type, agent)
                res.cookie('access-token', accessToken,  { maxAge: 1*60*1000, httpOnly: true })
                res.cookie('type', data.type, { maxAge: 1*60*1000, httpOnly: true })
                res.json({
                    code: 200,
                    refreshToken,
                    data
                })
            }
        } catch (error) {
            res.json(error)
        }
        
        
    }
}

module.exports = new WriterController()