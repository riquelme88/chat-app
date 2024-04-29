"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = exports.hasUser = exports.registerPage = exports.loginPage = exports.redirect = void 0;
const userModel_1 = require("../model/userModel");
const redirect = (req, res) => {
    res.redirect('/login');
};
exports.redirect = redirect;
const loginPage = (req, res) => {
    res.render('pages/login');
};
exports.loginPage = loginPage;
const registerPage = (req, res) => {
    res.render('pages/register');
};
exports.registerPage = registerPage;
exports.hasUser = '';
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let email = req.body.email;
    let password = req.body.password;
    let error = "Usuario está incorreto";
    exports.hasUser = yield userModel_1.User.findOne({
        where: {
            email,
            password
        }
    });
    exports.hasUser ? res.redirect('./chat') : res.render('pages/login', {
        error
    });
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password, name } = req.body;
    let hasUser = yield userModel_1.User.findOne({
        where: {
            email
        }
    });
    if (hasUser) {
        res.render('pages/register', {
            error: "Email já existente!"
        });
    }
    else {
        let user = yield userModel_1.User.build({
            email,
            password,
            name
        });
        if (user) {
            if (email != '' && password != '' && name != '') {
                yield user.save();
                //const token = generateToken({id : user.id});
                res.redirect('/login');
            }
            else {
                console.log('Faltou informação');
                res.render('pages/register', {
                    error: 'Está faltando informação!!'
                });
            }
        }
    }
});
exports.register = register;
