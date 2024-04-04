import { Request, Response } from "express";
import { User, UserModel } from "../model/userModel";
import { generateToken} from '../config/passport'
import { where } from "sequelize";


export const redirect = (req: Request, res: Response)=>{
    res.redirect('/login')
}
export const loginPage = (req : Request, res : Response) =>{
    res.render('pages/login')
}
export const registerPage = (req: Request, res : Response) =>{
    res.render('pages/register')
}

/////////////////////////////

export const login = async (req : Request, res : Response)=>{
    let email = req.body.email
    let password = req.body.password

    let user= await User.findOne({
        where : {
            email,
            password
        }
    })

    if(user){
        const token = generateToken({id : user.id}); 
        console.log(token)
        res.json({status : true})
    }else{
        /*res.render('pages/login', {
            error : 'Email ou senha incorreto!'
        })*/
        res.json({status : false})
    }
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