import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';

interface Patient {
    Patient_Name: string;
    Regis_Num: string;
    Gender: string;
    Phone_Num: string;
    Emerg_Name: string;
    Emerg_PNum: string;
    Is_Filled?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { Patient_Name, Regis_Num, Gender, Phone_Num, Emerg_Name, Emerg_PNum } = req.body as Patient;

        if (!Patient_Name || !Regis_Num || !Gender || !Phone_Num || !Emerg_Name || !Emerg_PNum) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const existingPatient = await prisma.patient.findUnique({
            where: { Phone_Num },
        });

        if (existingPatient) {
            const hasFilledQuestionnaire = await prisma.questionnaire.findFirst({
                where: { Patient_id: existingPatient.Patient_id },
            });

            const isFilled = !!hasFilledQuestionnaire;

            if (existingPatient.Is_Filled !== isFilled) {
                await prisma.patient.update({
                    where: { Patient_id: existingPatient.Patient_id },
                    data: { Is_Filled: isFilled },
                });
            }

            return res.status(403).json({
                message: 'Patient already exists',
                patient: { ...existingPatient, Is_Filled: isFilled },
            });
        }

        const createdPatient = await prisma.patient.create({
            data: {
                Patient_Name,
                Regis_Num,
                Gender,
                Phone_Num,
                Emerg_Name,
                Emerg_PNum,
                Is_Filled: false,
            },
        });

        return res.status(201).json({ message: 'Patient created successfully', patient: createdPatient });
    } catch (error: any) {
        console.error('Error creating patient:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
