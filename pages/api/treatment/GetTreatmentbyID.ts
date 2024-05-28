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
            return res.status(400).json({ error: 'Invalid treatment ID' });
        }

        const treatment = await prisma.treatment.findUnique({
            where: {
                Treatment_Id: id,
            },
            include: {
                Category: {
                    select: {
                        Category_Id: true,
                        Category_Name: true,
                    },
                },
            },
        });

        if (!treatment) {
            return res.status(404).json({ error: 'Treatment not found' });
        }

        res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json(treatment);
    } catch (error) {
        console.error('Error fetching treatment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
