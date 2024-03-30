import {Request , Response} from 'express'


export const chat = (req : Request, res : Response)=>{
    res.render('pages/chat')
} 

