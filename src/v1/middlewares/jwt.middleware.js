const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
} = require('../utils/jwt')
const client = require('../databases/init.redis')

const checkBlackList = async(req, res, next) => {
    try {
        const result = await client.SISMEMBER('token:backlist', req.body.refreshToken)
        console.log("result", result)
        if(result) {
            const payload = await verifyRefreshToken(req.body.refreshToken)
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
        const payload = await verifyRefreshToken(req.body.refreshToken, userId)
        await client.SADD('token:backlist', req.body.refreshToken)
        const newAccessToken = await signAccessToken(userId, req.body.accessKey)
        const newRefreshToken = await signRefreshToken(userId, req.body.refreshKey)
        res.json({ 
            status: 200,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    } catch (err) {
        res.json({
            status: 500,
            error: err
        })
    }
}

module.exports = {
    checkBlackList,
    createNewToken
}