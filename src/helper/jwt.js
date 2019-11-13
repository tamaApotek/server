const jwt = require('jsonwebtoken')
const SECRET_JWT = process.env.JWT
function generateJWTToken(data){
    return jwt.sign({ data }, SECRET_JWT, { expiresIn: "2 days" })
}
function verifyToken(token){
    return jwt.verify(token, SECRET_JWT)
}
module.exports = {
    generateJWTToken,
    verifyToken
}