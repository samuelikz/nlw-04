import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body;
        
        const usersRepository = getCustomRepository(UserRepository); 

        const userAlreadyExist = await usersRepository.findOne({
            email
        })

        if(userAlreadyExist){
            return response.status(400).json({
                erro: "User Already Exist!",
            })
        }
        
        const user = usersRepository.create({
            name, email
        })

        await usersRepository.save(user);

        return response.send();
    }
}

export { UserController };
