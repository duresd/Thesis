import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

interface UpdatePatientRequest {
    patientId: string;
    patientName: string;
    regisNum: string;
    phoneNum: string;
    gender: string;
    emergName: string;
    emergPNum: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { patientId, patientName, regisNum, phoneNum, gender, emergName, emergPNum }: UpdatePatientRequest = req.body;

        if (!patientId || !patientName || !regisNum || !phoneNum || !gender || !emergName || !emergPNum) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingPatient = await prisma.patient.findUnique({
            where: { Patient_id: patientId },
        });

        if (!existingPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const updatedPatient = await prisma.patient.update({
            where: { Patient_id: patientId },
            data: {
                Patient_Name: patientName,
                Regis_Num: regisNum,
                Phone_Num: phoneNum,
                Gender: gender,
                Emerg_Name: emergName,
                Emerg_PNum: emergPNum,
            },
        });

        return res.status(200).json({ message: 'Patient details updated successfully', patient: updatedPatient });
    } catch (error) {
        console.error('Error updating patient details:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
