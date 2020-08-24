import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
    async index(req, res) {
        const checkUserProvider = await User.findOne({
            where: { id: req.userId, provider: true }
        });
        if (!(checkUserProvider)) {
            return res.status(401).json({ error: 'Usuário não é provedor'});
        }

        const { date } = req.query

        const appointments = await Appointment.findAll({
            where: { date: date, provider_id: req.userId, cancelled_at: null}
        })
        if (!appointments) {
            return res.json({ error: 'Não existem agendamentos com esse prestador'});
        }
        return res.json({ appointments });
    }
}

export default new ScheduleController();