import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

interface UpdateAppointmentStatusRequest {
    appointmentId: string;
    statusId: string;
    description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { appointmentId, statusId, description }: UpdateAppointmentStatusRequest = req.body;

        if (!appointmentId || !statusId || !description) {
            return res.status(400).json({ error: 'Appointment ID, status ID, and description are required.' });
        }

        const existingAppointment = await prisma.appointment.findUnique({
            where: {
                Appointment_Id: appointmentId,
            },
        });

        if (!existingAppointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        const updatedAppointment = await prisma.appointment.update({
            where: {
                Appointment_Id: appointmentId,
            },
            data: {
                Status_id: statusId,
            },
        });

        const createdHistory = await prisma.patient_history.create({
            data: {
                Appointment_Id: appointmentId,
                Description: description,
            },
        });

        return res.status(200).json({ message: 'Appointment status updated successfully', appointment: updatedAppointment, history: createdHistory });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
