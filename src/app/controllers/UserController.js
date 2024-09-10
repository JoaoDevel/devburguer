/* 
 
 * store => cadastrar / adicionar
 * index => listar várias
 * show => listar apenas um
 * update => atualizar 
 * delete => deletar

*/

import { v4 } from "uuid"
import * as Yup from "yup"

import User from "../models/User"



class UserController {
    async store(request, response) {

        const schema = Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
            admin: Yup.boolean(),
        })

        try{
            schema.validateSync(request.body, { abortEarly: false })
        } catch(err){
            return response.status(400).json({ error: err.errors })
        }

        const { name, email , password, admin } = request.body

        const userExist = await User.findOne({
            where: {
                email,
            }
        })

        /**
         * null, underfined, 0 -> false
         * {}, [] -> true
         */

        if(userExist) {
            return response.status(400).json({ error: "User already exist" })
        }

        const user = await User.create({
            id: v4(),
            name ,
            email ,
            password,
            admin,
           })
        
           return response.status(201).json({
            id: user.id,
            name,
            email,
            admin,
           })
    }
}

export default new UserController