import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

interface UpdateAppointmentStatusRequest {
    appointmentId: string;
    statusId: string;
    description: string;
    doctorId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { doctorId, appointmentId, statusId, description }: UpdateAppointmentStatusRequest = req.body;

        if (!statusId) {
            return res.status(400).json({ error: 'doctorId, appointmentId, statusId, and description are required fields.' });
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
                Doctor_Id: doctorId,
                Status_id: statusId,
                Description: description,
            },
        });

        const createdHistory = await prisma.patient_history.create({
            data: {
                Appointment_Id: appointmentId,
                Description: description,
            },
        });

        return res.status(200).json({ message: 'Doctor, status, and description updated successfully', appointment: updatedAppointment, history: createdHistory });
    } catch (error) {
        console.error('Error updating appointment:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
