const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessToken
} = require('../utils/jwt')
const createError = require('../utils/create-error')
const client = require('../databases/init.redis')

const checkBlackList = async(req, res, next) => {
    try {
        const result = await client.SISMEMBER('token:backlist', req.body['refresh-token'])
        const userId = req.body.userId || req.query.userId || req.cookies['userId']
        const agent = req.headers['user-agent']
        // const result = false
        console.log("result", result)
        if(result) {
            const payload = await verifyRefreshToken(req.body['refresh-token'], userId,agent)
            await client.del([`${payload.userId}-access`, `${payload.userId}-refresh`, `${payload.userId}-token`])
            res.json({
                status: 409,
                error: "New token was generated",
                message: "Please login again"
            })
        } else {
            next()
        }
    } catch (error) {
        res.json({status: 400, error})
    }
};

const createNewToken = async(req, res, next) => {
    try {
        const userId = req.body.userId || req.query.userId || req.cookies['userId']
        const agent = req.headers['user-agent']
        const token = req.body['refresh-token']
        const payload = await verifyRefreshToken(req.body['refresh-token'], userId, agent)
        // await client.SADD('token:backlist', req.body['refresh-token'])
        const type = payload.type
        const newAccessToken = await signAccessToken(userId, type, agent)
        res.cookie('access-token', newAccessToken, { maxAge: 5*60*1000, httpOnly: true, sameSite: 'None', secure: true})
        res.cookie('userId', userId, {httpOnly: true, sameSite: 'None', secure: true})
        console.log('success', newAccessToken)
        res.json({
            code: 200,
        })
    } catch (err) {
        console.log('err', err)
        res.json(createError.InternalServerError(err))
    }
}

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies['access-token']
        if(!token) {
            res.json(createError.Unauthorized())
            return
        }
        const userId = req.body.userId || req.query.userId || req.cookies['userId']
        const agent = req.headers['user-agent']
        console.log(token, userId, agent)
        const payload = await verifyAccessToken(token, userId, agent)
        console.log(payload)
        if (payload?.code === 200) {
            req.userId = userId
            req.role = payload.payload.type
            next()
        } else {
            res.json(createError.Unauthorized(payload))
        }
    } catch (err) {
        res.json(createError.Unauthorized(err))
    }
}

module.exports = {
    checkBlackList,
    createNewToken,
    verifyToken
}