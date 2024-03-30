import { Sequelize, Model, DataTypes } from "sequelize";
import {sequelize} from '../instances/mysql'

export interface UserModel extends Model {
    id : number,
    name : string,
    email : string, 
    password : string
}

export const User = sequelize.define<UserModel>('user',{
    id : {
        primaryKey : true,
        type : DataTypes.INTEGER
    },
    name : {
        type : DataTypes.STRING
    },
    email : {
        type : DataTypes.STRING
    },
    password : {
        type : DataTypes.STRING
    }
},
{
    timestamps : false,
    tableName : 'users'
})