import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const Questions = await prisma.questions.findMany();

        res.status(200).json(Questions);
    } catch (error) {
        console.error('Error fetching qeustions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
