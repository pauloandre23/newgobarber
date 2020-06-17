import {Router} from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req,res)=>{
    const user = await User.create({
        name: 'paulo',
        email: 'paulo@gowdock.com',
        password_hash: '1423412342',
    });

    return res.json(user);
})
export default routes;