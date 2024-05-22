import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const Doctor = await prisma.doctor.findMany({
            select: {
                Doctor_id: true,
                Doctor_Name: true,
                Profession: {
                    select: {
                        Profession_Name: true,
                    },
                },
                Doctor_Rnum: true,
                Doctor_Pnum: true,
                hashedPassword: true,
                Gender: true,
                Role: true,
                created_At: true,
                updatedAt: true,
            },
        });

        res.status(200).json(Doctor);
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
