import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const { Question } = req.body;

        if (!Question) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const createdQuestions = await prisma.questions.create({
            data: {
                Question,
            },
        });

        return res.status(201).json({ createdQuestions });
    } catch (error) {
        console.error('Error creating question:', error);
        return res.status(500).json({
            message: 'Server Error',
        });
    }
}
