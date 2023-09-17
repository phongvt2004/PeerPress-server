const crypto = require('crypto');

module.exports = () => {
    const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
          },
    })
    console.log((privateKey, publicKey))
    return {privateKey, publicKey}
}