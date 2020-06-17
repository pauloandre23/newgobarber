import User from '../models/User'

 class UserController{
    async store(req,res){
        const user = User.create(req.body)
        return res.json(user)
    }
}

export default new UserController();