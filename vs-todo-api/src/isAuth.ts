import { RequestHandler } from "express"
import jwt from "jsonwebtoken";

export const isAuth:RequestHandler<{}, any, any, {}>=(req,_res,next)=>{
    const authHeader =req.headers.authorization;
    if (!authHeader) {
      throw new Error('not Authenticated')
      
    }
    const token=authHeader.split(" ")[1];
    if (!token) {
        throw new Error('not Authenticated')
    }
    
    try {
     const payload:any= jwt.verify(token,process.env.jwt_secret);
     req.userId=payload.userId;
     next()
     return
     
    } catch (error) {
        throw new Error('not Authenticated')
    }
    throw new Error('not Authenticated')
    // const user =await User.findOne(userId)
    // res.send({user})


    next()
}