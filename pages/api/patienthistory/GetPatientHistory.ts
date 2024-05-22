import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const History = await prisma.patient_history.findMany({
            select: {
                Appointment_Id: true,
                Appointment: {
                    select: {
                        Startdate: true,
                        Enddate: true,
                        Doctor: {
                            select: {
                                Doctor_Name: true,
                                Profession: {
                                    select: { Profession_Name: true },
                                },
                            },
                        },
                    },
                },
                Description: true,
                created_At: true,
            },
        });

        res.status(200).json(History);
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
