// fetchuser.js
var jwt = require('jsonwebtoken');
const jwt_secret = 'hdshvc';  //write a code for safety and pass it as a string

const fetchuser=(req,res,next)=>{
    // Get the user from jwtToken and add id to required object
    const token=req.header('auth-token');
    // const token = req.header('auth-token')?.replace('Bearer ', '');

    if(!token){
        res.status(401).send({error:'plz authenticate using a valid number'})
    }
    
    try {
        const data=jwt.verify(token,jwt_secret);
    req.user=data.user;
    next();
    } catch (error) {
        res.status(401).send({error:'plz authenticate using a valid number'})   
    }

}




module.exports =fetchuser;
