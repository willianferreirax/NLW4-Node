import {Request, Response} from 'express'
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from "yup"
import { AppError } from '../errors/AppError';


class UserController{
    async create(request: Request, response: Response){
        const {name, email} = request.body;

        const schema = yup.object().shape({
            name: yup.string().required("nome é obrigatorio"),
            email: yup.string().email().required("email invalido")
        })

        // if (!(await schema.isValid(request.body))){
        //     return response.status(400).json({
        //         error: "validation failed"
        //     })
        // } outro jeito de fazer

        try{//abortEarly para de verificar assim que a primeira falhar
            await schema.validate(request.body, {abortEarly:false})
        }
        catch(err){
            throw new AppError(err)
        }
        

        const usersRepository = getCustomRepository(UsersRepository)

        // SELECT * FROM USERS WHERE EMAIL = EMAIL
        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        if(userAlreadyExists){
            throw new AppError("User already exists!")
        }

        const user = usersRepository.create({
            name,email
        })

        await usersRepository.save(user)

        return response.status(201).json(user);
    }
}

export {UserController}