import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const { Treatment_Name, Treatment_Category_Id } = req.body;

        if (!Treatment_Name || !Treatment_Category_Id) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const createdTreatment = await prisma.treatment.create({
            data: {
                Treatment_Name,
                Treatment_Category_Id,
            },
        });

        return res.status(201).json({ createdTreatment });
    } catch (error) {
        console.error('Error creating epmloyee:', error);
        return res.status(500).json({
            message: 'Server Error',
        });
    }
}
