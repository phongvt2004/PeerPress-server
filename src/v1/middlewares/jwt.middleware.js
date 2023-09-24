const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessToken
} = require('../utils/jwt')
const createError = require('http-errors')
const client = require('../databases/init.redis')

const checkBlackList = async(req, res, next) => {
    try {
        const result = await client.SISMEMBER('token:backlist', req.cookies['refresh-token'])
        const userId = req.body.userId || req.query.userId || req.cookies['userId']
        const agent = req.headers['User-Agent']
        console.log("result", result)
        if(result) {
            const payload = await verifyRefreshToken(req.cookies['refresh-token'], userId,agent)
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
        const agent = req.headers['User-Agent']
        const payload = await verifyRefreshToken(req.body.refreshToken, userId, agent)
        await client.SADD('token:backlist', req.cookies['refresh-token'])
        const type = req.body.type || req.query.type || req.cookies['type']
        const newAccessToken = await signAccessToken(userId, type, req.cookies['access-token'], agent)
        const newRefreshToken = await signRefreshToken(userId,type, req.cookies['refresh-token'], agent)
        res.cookies('access-token', newAccessToken)
        res.json({ 
            status: 200,
            refreshToken: newRefreshToken
        })
    } catch (err) {
        res.json({
            status: 500,
            error: err
        })
    }
}

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies['access-token']
        const userId = req.body.userId || req.query.userId || req.cookies['userId']
        const agent = req.headers['User-Agent']
        const payload = await verifyAccessToken(token, userId, agent)
        if (payload?.code === 200) {
            req.role = payload.type
            next()
        }
    } catch (err) {

    }
}

module.exports = {
    checkBlackList,
    createNewToken
}