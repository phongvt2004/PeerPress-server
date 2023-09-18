const jwt = require('jsonwebtoken');
const keyGen = require('./gen_key');
const client = require('../databases/init.redis')
const createError = require('http-errors')

module.exports = {
    signAccessToken: async (userId, privateKey = null) => {
        return new Promise(async (resolve, reject) => {
            const payload = {
                userId,
            }
            console.log(userId, privateKey)
            if(!privateKey) {
                let key = keyGen()
                await client.set(`${userId}-access`, key.publicKey)
		console.log(key)
                privateKey = key.privateKey
            }
            console.log(userId, privateKey)
            const options = {
                algorithm: 'RS256',
                expiresIn: '1m'
            }
            jwt.sign(payload, privateKey, options, async(err, token) => {
                if (err?.message) {
                    console.log(err)
                    reject(err)
                }
                console.log({token, privateKey})
                resolve({token, privateKey})
            })
            
        })
    }
    ,
    verifyAccessToken: async(req, res, next) => {
        if(!req.headers['authorization']) {
            return next(createError.Unauthorized())
        }
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        const userId = req.body.userId || req.query.userId || req.cookies['userId']
        const key = await client.get(`${userId}-access`)
        jwt.verify(token, key, (err, payload) => {
            if(err) {
                if(err.name === 'JsonWebTokenError') return next(createError.Unauthorized())
                return next(createError.Unauthorized(err.message)) //jwt expired
            }
            req.payload = payload
            next()
        })
    },
    signRefreshToken: async (userId, privateKey = null) => {
        return new Promise(async (resolve, reject) => {
            const payload = {
                userId,
            }
            if(!privateKey) {
                const key = keyGen()
                await client.set(`${userId}-refresh`, key.publicKey)
                privateKey = key.privateKey
            }
            const options = {
                algorithm: 'RS256',
                expiresIn: '1y'
            }
            jwt.sign(payload, privateKey, options, async(err, token) => {
                if (err?.message) reject(createError.InternalServerError())
                await client.setEx(`${userId}-token`, 365*24*60*60, token)
                resolve({token, privateKey})
            })
            
        })
    }
    ,
    verifyRefreshToken: async (token, userId) => {
        return new Promise(async (resolve, reject) => {
            
            try {
                const key = await client.get(`${userId}-refresh`)
                jwt.verify(token, key, async(err, payload) => {
                    if(err) {
                        if(err.name === 'JsonWebTokenError') return reject(createError.Unauthorized())
                        return reject(createError.Unauthorized(err.message))
                    }
                    const reply = await client.get(`${userId}-token`)
                    console.log(reply)
                    if(token === reply) resolve(payload)
                    else reject(createError.Unauthorized())
                })
            } catch (err) {
                reject(createError.InternalServerError())
            }
        })
    }
}
