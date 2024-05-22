import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const Treatment = await prisma.treatment.findMany();

        res.setHeader('Cache-Control', 'no-cache');

        res.status(200).json(Treatment);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
