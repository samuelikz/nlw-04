import { UserRepository } from "../repositories/UserRepository";
import {resolve} from 'path';
import { Request, Response} from 'express';
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveyUsersRepository } from "../repositories/SurveysUsersRepository";
import SendMailService from "../services/SendMailService";


class SendMailController {
    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;
        
        const userRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);
        
        const userAlreadyExists = await userRepository.findOne({email})
        
        if(!userAlreadyExists){
            return response.status(400).json({
                erro: "User does not exists!"
            })
        }
        
        const surveyAlreadyExists = await surveysRepository.findOne({id: survey_id})
        
        if(!surveyAlreadyExists){
            return response.status(400).json({
                erro: "Surveys does not exists!"
            })
        }
        
        const surveyAlUserExists = await surveyUsersRepository.findOne({
            where: [{user_id: userAlreadyExists.id}, {value: null}],
            relations :["user", "survey"]
        });        

        const variables = {
            name: userAlreadyExists.name,
            title: surveyAlreadyExists.title,
            description: surveyAlreadyExists.description,
            user_id: userAlreadyExists.id,
            link: process.env.URL_MAIL
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsEmail.hbs");

        if(surveyAlUserExists){
            await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath);
            
            return response.json(surveyAlreadyExists);
        }

        const surveyUser = surveyUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        })
        await surveyUsersRepository.save(surveyUser);


        await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath);

        return response.json(surveyUser)
    }
}

export { SendMailController }