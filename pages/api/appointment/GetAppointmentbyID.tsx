import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid Patient ID' });
        }

        const Appointment = await prisma.appointment.findUnique({
            where: {
                Appointment_Id: id,
            },
            select: {
                Startdate: true,
                Enddate: true,
                Doctor: {
                    select: {
                        Doctor_Name: true,
                    },
                },
                Patient: {
                    select: {
                        Patient_id: true,
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
                Status: {
                    select: {
                        Status_Name: true,
                    },
                },
                Description: true,
                created_At: true,
            }
        });

        if (!Appointment) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json(Appointment);
    } catch (error) {
        console.error('Error fetching status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
