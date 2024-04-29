import { Request, Response } from "express";
import { User, UserModel } from "../model/userModel";
import { where } from "sequelize";
import { privateRoute } from "../config/passport";
import { NextFunction } from "express-serve-static-core";


export const redirect = (req: Request, res: Response)=>{
    res.redirect('/login')
}
export const loginPage = (req : Request, res : Response) =>{
    res.render('pages/login')
}
export const registerPage = (req: Request, res : Response) =>{
    res.render('pages/register')
}

export let hasUser : any = ''

export const login = async (req : Request, res : Response, next : NextFunction)=>{
    let email = req.body.email
    let password = req.body.password
    let error = "Usuario está incorreto"

    hasUser = await User.findOne({
        where : {
            email,
            password
        }
    })
    hasUser ? res.redirect('./chat') : res.render('pages/login', {
        error
    })
}

export const register = async (req: Request, res : Response)=>{
    let {email, password, name} = req.body

    let hasUser = await User.findOne({
        where : {
            email
        }
    })

    if(hasUser){
        res.render('pages/register', {
            error : "Email já existente!"
        })
    }else{
        let user = await User.build({
            email,
            password,
            name
        })
        if(user){
            if(email != '' && password != '' && name != ''){
                await user.save()
                //const token = generateToken({id : user.id});
                res.redirect('/login')
            }else{
                console.log('Faltou informação')
                res.render('pages/register', {
                    error : 'Está faltando informação!!'
                })
            }
        }
    }
}