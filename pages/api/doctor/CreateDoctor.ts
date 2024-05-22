import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const { Doctor_Name, Profession_Id, Doctor_Pnum, Doctor_Rnum, Gender, Role, password } = req.body;

        if (!Doctor_Name || !Profession_Id || !Doctor_Pnum || !Doctor_Rnum || !Gender || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdDoctor = await prisma.doctor.create({
            data: {
                Doctor_Name,
                Profession_Id,
                Gender,
                Doctor_Rnum,
                Doctor_Pnum,
                hashedPassword,
                Role,
            },
        });

        return res.status(201).json({ createdDoctor });
    } catch (error) {
        console.error('Error creating epmloyee:', error);
        return res.status(500).json({
            message: 'Server Error',
        });
    }
}
