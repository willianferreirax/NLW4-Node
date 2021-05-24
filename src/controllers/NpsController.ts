import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


/**
 * calculo nps
 * 
 * 1 2 3 4 5 6 7 8 9 10
 * 
 * Detratores -> 0 - 6
 * Passivos -> 7 - 8
 * Promotores -> 9 - 10
 * 
 * Passivos são desconsiderados
 * 
 * (numero de promotores - numero de detratores)/ (numero de respondentes(conta passivo)) * 100
 */

class NpsController{
    async execute(request:Request, response:Response){
        const {survey_id} = request.params

        const surveyUserRepository = getCustomRepository(SurveysUsersRepository)
        const surveyUsers = await surveyUserRepository.find({
            survey_id,
            value: Not(IsNull())//nao seja nullo
        })

        const detractor = surveyUsers.filter(
            survey => (survey.value >= 0 && survey.value <= 6)
        ).length

        const promoters = surveyUsers.filter(
            (survey) => survey.value >=9 && survey.value <=10
        ).length

        const passive = surveyUsers.filter(
            (survey) => survey.value >=7 && survey.value <=8
        ).length

        const totalAnswers = surveyUsers.length

        const calculate = Number((((promoters - detractor) / totalAnswers) *100).toFixed(2))

        return response.json({
            detractor,
            promoters,
            passive,
            totalAnswers,
            nps : calculate
        })
    }
}

export {NpsController}