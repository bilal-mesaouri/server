const jwt = require('jsonwebtoken')

const requireAuth =(req,res,next)=>{
    const token = req.cookies.jwt
    console.log('inside require auth')
    if(!token)res.sendStatus(404);
    else{
        jwt.verify(token,process.env.jwt_secret,(err,decodedToken)=>{
            if(err)res.sendStatus(404);
            else next();
    })}
}
module.exports = {requireAuth}