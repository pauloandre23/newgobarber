import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import pt from 'date-fns/locale/pt';
import Notification from '../schemas/Notification';

import {startOfHour, parseISO, isBefore, format, subHours} from 'date-fns';
import * as Yup from 'yup';
class AppointmentController {
    async index (req, res) {
        const { page = 1 } = req.query;

        const appointments = await Appointment.findAll({
            where: { user_id: req.userId, cancelled_at: null},
            order: ['date'],
            attributes: ['id', 'date'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path','url']
                        }
                    ]
                }
            ]
        });

        return res.json(appointments);
    }

    async store (req, res) {
        const schema = Yup.object().shape({
            date: Yup.date().required(),
            provider_id: Yup.number().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: 'Validação falhou',
            });
        }
        const { provider_id, date } = req.body;

        const checkIsProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!checkIsProvider) {
            return res
            .status(401)
            .json({ error: 'Só se deve criar agendamentos com provedores de serviços'});
        }

        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())) {
            return res.json({ error: 'Datas passadas não são permitidas.'});
        }

        const checkAvailability = await Appointment.findOne({
            where: {
                date: hourStart,
                provider_id,
                cancelled_at: null,}
            });
        if (checkAvailability) {
            return res.status(400).json({error: 'Data de agendamento não permitida.'})
        }

        
        if (req.userId === provider_id) {
            return res
            .status(400)
            .json({ error: 'Não pode agendar a si mesmo =D' });
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date,
        });

        const user = User.findByPk(req.userId);
        const formattedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            { locale: pt} 
        );

        await Notification.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate}`,
            user: provider_id,  
        });

        return res.json(appointment);
    }
}

export default new AppointmentController();