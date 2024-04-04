import passport from "passport";
import dotenv from 'dotenv'
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt'
import { User } from "../model/userModel";
import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { BasicStrategy } from "passport-http";

// Passport Stategy = JWT

dotenv.config()
const notAthorizedJson = {status : 401, message : 'Não autorizado'};
const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET as string
}


passport.use(new JWTStrategy(options, async (payload, done) =>{
    const user = await User.findByPk(payload.id)
    if(user){
        return done(null, user)
    }else{
        return done(notAthorizedJson, false)
    }
}));

export const privateRoute = (req :Request, res: Response, next : NextFunction)=>{
    passport.authenticate('jwt', (err : string, user : string)=>{
        req.user = user
        user ? next() : next(notAthorizedJson)
    })(req,res,next)
}

export const generateToken = (data : object)=>{
    return jwt.sign(data, process.env.JWT_SECRET as string)
}


export default passport


// Basci Strategy
/*
const notAthorizedJson = {status : 401, message : 'Não autorizado'}

passport.use(new BasicStrategy( async (email,password,done)=>{
    if(email && password){
        const user = await User.findOne({where: {email,password}});
        if(user){
            return done(null,user)
        }
    }
    return done(notAthorizedJson, false)
}));

export const privateRoute = (req : Request,res : Response,next : NextFunction)=>{
    const authFunction = passport.authenticate('basic', (err : any ,user : any)=>{
        return user ? next() : next(notAthorizedJson);
    })
    authFunction(req,res,next)
}*/

























