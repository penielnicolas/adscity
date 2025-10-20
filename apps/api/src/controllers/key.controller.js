const { generateKeyPairSync } = require('crypto');

exports.generateKeys = async (req, res) => {
    const { publicKey, privateKey } = generateKeyPairSync('ec', {
        namedCurve: 'P-256', // ou 'prime256v1'
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    res.json({ publicKey, privateKey });
};