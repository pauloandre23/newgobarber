import User from '../models/User'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import * as Yup from 'yup'

 class SessionController{
    async store(req,res){
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required()
        })
        if(!schema.isValid(req.body)) {
            return res.status(400).json({error: 'Falha no login. Campo(s) faltando.'})
        }
        const { email, password } = req.body

        const user = await User.findOne({where: {email}})

        if (!user){
            return res.status(401).json({error: "Usuário não encontrado"})
        }

        if (!(await user.checkPassword(password))){
            return res.status(401).json({error: "Senha incorreta"})
        }

        const {id, name} = user;
        return res.json({
            user: {
            id,
            name,
            email
        }, 
        token: jwt.sign({id}, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
            }),   
        });
    }
}

export default new SessionController();