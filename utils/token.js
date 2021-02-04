const jwt = require('jsonwebtoken')
const errorMessage = require('./error')
/**
 * Generate a token
 * @param email - User email
 * @returns A token with expiry
 */
exports.generateToken = (email) =>{
  const secretKey = process.env.SECRET_KEY
  const expires_in = 24 * 60 * 60
  const exp = Math.floor(Date.now()/1000) + expires_in
  const payload = {
    email, 
    exp
  }
  const token = jwt.sign(payload, secretKey)
  return {token, expires_in}
}

/**
 * Get token from request header
 * @param authorization - Authorization from the header
 * @returns
 */
exports.validateToken = (authorization) => {
  if(authorization && authorization.split(' ').length === 2){
    const token = authorization.split(' ')[1]
    const secretKey = process.env.SECRET_KEY
    try{
      const decoded = jwt.verify(token, secretKey)
      if(decoded.exp > Date.now()){
        return {error: true, ...errorMessage.tokenExpired}
      }else{
        return {error: false}
      }
    }catch(e){
      return {error: true,  ...errorMessage.jwtMaldormed}
    }
  }else{
    return {error: true, ...errorMessage.tokenNotFound};
  }
}
