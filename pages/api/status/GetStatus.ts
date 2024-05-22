import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const Status = await prisma.status.findMany();

        res.setHeader('Cache-Control', 'no-cache');

        res.status(200).json(Status);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
