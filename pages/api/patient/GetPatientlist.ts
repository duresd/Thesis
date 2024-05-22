import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

interface Patient {
    Patient_id: string;
    Patient_Name: string;
    Phone_Num: string;
    Gender: string;
    Regis_Num: string;
    Emerg_Name: string;
    Emerg_PNum: string;
    appointment: {
        Startdate: Date;
    }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const patients: Patient[] = await prisma.patient.findMany({
            select: {
                Patient_id: true,
                Patient_Name: true,
                Phone_Num: true,
                Gender: true,
                Regis_Num: true,
                Emerg_Name: true,
                Emerg_PNum: true,
                appointment: {
                    select: { Startdate: true },
                },
            },
        });

        res.setHeader('Cache-Control', 'no-cache');

        res.status(200).json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
