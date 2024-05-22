import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const { Status_Name } = req.body;

        if (!Status_Name) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const createdStatus = await prisma.status.create({
            data: {
                Status_Name,
            },
        });

        return res.status(201).json({ createdStatus });
    } catch (error) {
        console.error('Error creating epmloyee:', error);
        return res.status(500).json({
            message: 'Server Error',
        });
    }
}
