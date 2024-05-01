import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { NextFunction } from "express-serve-static-core";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()



export const redirect = (req: Request, res: Response) => {
    res.redirect('/login')
}
export const loginPage = (req: Request, res: Response) => {
    res.render('pages/login')
}
export const registerPage = (req: Request, res: Response) => {
    res.render('pages/register')
}

export let user: any = ''

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    user = await prisma.user.findFirst({ where: { email } })
    let error = 'Usuario não encontrado!'

    if (!user) {
        res.render('pages/login', {
            error
        })
        return
    }
    const match = await bcrypt.compare(password, user?.password as string)
    if (!match) {
        error = 'Senha incorreta'
        res.render('pages/login', {
            error
        })
        return
    }

    res.redirect('/chat')
    next()
}

export const register = async (req: Request, res: Response) => {
    let { email, password, name } = req.body

    let hasUser = await prisma.user.findFirst({ where: { email } })

    if (hasUser) {
        res.render('pages/register', {
            error: "Email já existente!"
        })
        return
    }

    if (email === '' || password === '' || name === '') {
        res.render('pages/register', {
            error: 'Campo em falta'
        })
        return
    }
    const passwordHash = bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: {
            email,
            password: (await passwordHash).toString(),
            name
        }
    })


    res.redirect('/login')
}