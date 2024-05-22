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
            return res.status(400).json({ error: 'Invalid Doctor ID' });
        }

        const Doctor = await prisma.doctor.findUnique({
            where: {
                Doctor_id: id,
            },
        });

        if (!Doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json(Doctor);
    } catch (error) {
        console.error('Error fetching status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
