import Appointment from '../models/Appointment';
import User from '../models/User';
import { parseISO, startOfDay } from 'date-fns';
import { Op } from 'sequelize';
import { endOfDay } from 'date-fns';

class ScheduleController {
    async index(req, res) {
        const checkUserProvider = await User.findOne({
            where: { id: req.userId, provider: true }
        });
        if (!(checkUserProvider)) {
            return res.status(401).json({ error: 'Usuário não é provedor'});
        }

        const { date } = req.query
        const parsedDate = parseISO(date);

        const appointments = await Appointment.findAll({
            where: { 
                date: {[Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]},
                provider_id: req.userId,
                cancelled_at: null
            }
        })
        if (!appointments) {
            return res.json({ error: 'Não existem agendamentos com esse prestador'});
        }
        return res.json({ appointments });
    }
}

export default new ScheduleController();