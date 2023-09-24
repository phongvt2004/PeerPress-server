const jwt = require('jsonwebtoken');
const keyGen = require('./gen_key');
const client = require('../databases/init.redis')
const createError = require('http-errors')

module.exports = {
    signAccessToken: async (userId, type, privateKey = null, agent) => {
        return new Promise(async (resolve, reject) => {
            const payload = {
                userId,
                type
            }
            console.log(userId, privateKey)
            if(!privateKey) {
                let key = keyGen()
                await client.set(`${userId}-${agent}-access`, key.publicKey)
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
                await client.setEx(`${userId}-${agent}-access-token`, 1*60, token)
                resolve(token)
            })
            
        })
    }
    ,
    verifyAccessToken: async(token, userId, agent) => {
        return new Promise(async (resolve, reject) => {

            const key = await client.get(`${userId}-${agent}-access`)
            jwt.verify(token, key, async (err, payload) => {
                if(err) {
                    if(err.name === 'JsonWebTokenError') reject(createError.Unauthorized(err))
                    reject(createError.InternalServerError(err)) //jwt expired
                }
                const reply = await client.get(`${userId}-${agent}-access-token`)
                if(token === reply && reply) resolve({
                    code: 200,
                    payload
                })
            })
        })
        
        
    },
    signRefreshToken: async (userId,type, privateKey = null, agent = '') => {
        return new Promise(async (resolve, reject) => {
            const payload = {
                userId,
                type
            }
            if(!privateKey) {
                const key = keyGen()
                await client.set(`${userId}-${agent}-refresh`, key.publicKey)
                privateKey = key.privateKey
            }
            const options = {
                algorithm: 'RS256',
                expiresIn: '1y'
            }
            jwt.sign(payload, privateKey, options, async(err, token) => {
                if (err?.message) reject(createError.InternalServerError())
                await client.setEx(`${userId}-${agent}-refresh-token`, 365*24*60*60, token)
                resolve(token)
            })
            
        })
    }
    ,
    verifyRefreshToken: async (token, userId, agent) => {
        return new Promise(async (resolve, reject) => {
            
            try {
                const key = await client.get(`${userId}-${agent}-refresh`)
                jwt.verify(token, key, async(err, payload) => {
                    if(err) {
                        if(err.name === 'JsonWebTokenError') return reject(createError.Unauthorized(err))
                        return reject(createError.InternalServerError(err))
                    }
                    const reply = await client.get(`${userId}-${agent}-refresh-token`)
                    if(token === reply && reply) resolve(payload)
                    else reject(createError.Unauthorized("Re login"))
                })
            } catch (err) {
                reject(createError.InternalServerError(err))
            }
        })
    }
}
