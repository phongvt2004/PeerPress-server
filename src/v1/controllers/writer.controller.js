
const writerService = require('../services/writer.service')
const createError = require('../utils/create-error')

const {
    signAccessToken,
    signRefreshToken,
} = require('../utils/jwt')
const TOKEN = process.env.SECRET_TOKEN || "PeerPressToken"

class WriterController {
    async create(req, res, next) {
        try {
            const{
                username,
                type,
                password,
                token
            } = req.body
            if(token !== TOKEN) {
                res.json(createError.Forbidden())
                return
            }
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
                res.cookie('userId', data._id.toString())
                res.json({
                    status: 200,
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
                res.cookie('access-token', accessToken,  { maxAge: 5*60*1000})
                res.cookie('userId', data._id)
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