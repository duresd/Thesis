import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const futureAppointments = await prisma.appointment.findMany({
            where: {
                Startdate: {
                    gt: new Date(),
                },
            },
            select: {
                Appointment_Id: true,
                Startdate: true,
                Enddate: true,
                Doctor: {
                    select: {
                        Doctor_Name: true,
                    },
                },
                Patient: {
                    select: {
                        Patient_Name: true,
                        Phone_Num: true,
                    },
                },
                Category: {
                    select: {
                        Category_Name: true,
                    },
                },
                Employee: {
                    select: {
                        Employee_Name: true,
                    },
                },
                Employee_Id: true,
                Status: {
                    select: {
                        Status_Name: true,
                    },
                },
                Description: true,
                created_At: true,
            },
        });

        return res.status(200).json(futureAppointments);
    } catch (error) {
        console.error('Error fetching future appointments:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
