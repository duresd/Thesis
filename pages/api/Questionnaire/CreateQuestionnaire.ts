import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const { Question_Id, Patient_id, Answer } = req.body;

        if (!Question_Id || !Patient_id || !Answer) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create the questionnaire
        const createdQuestionnaire = await prisma.questionnaire.create({
            data: {
                Question_Id,
                Patient_id,
                Answer,
            },
        });

        // Update the patient's isFilled field to true
        await prisma.patient.update({
            where: {
                Patient_id: Patient_id,
            },
            data: {
                Is_Filled: true,
            },
        });

        return res.status(201).json({ createdQuestionnaire });
    } catch (error) {
        console.error('Error creating question:', error);
        return res.status(500).json({
            message: 'Server Error',
        });
    }
}
