import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

//http://localhost:3333/answers/1?u=dca95532-8154-4d21-b807-70175526af78
/**
 * Route params - parametros que compoem a rota (exemplo: /1)
 * routes.get("/answers/:value")
 * 
 * 
 * Query Params - busca, paginação, não-obrigatorios, rota continua funcionando mesmo se nao passados
 * sempre vem depois de ?
 * chave=valor
 */
class AnswerController{
    async execute(request:Request, response:Response){
        const {value} = request.params;
        const {u} = request.query

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        })

        if(!surveyUser){
            //lança o erro pra cima ( pra classe que chamou essa e assim por diante ate a ultima)
            throw new AppError("Survey user does not exists") 
        }

        surveyUser.value = Number(value)

        await surveysUsersRepository.save(surveyUser)

        return response.json(surveyUser)
    }
}

export { AnswerController}