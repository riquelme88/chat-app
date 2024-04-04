import {Request , Response} from 'express'


export const chat = (req : Request, res : Response)=>{
    //res.render('pages/chat')
    res.json({status : true})
} 

