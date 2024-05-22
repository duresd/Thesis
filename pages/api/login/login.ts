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
        const { Employee_Pnum, password } = req.body;

        if (!Employee_Pnum || !password) {
            return res.status(422).json({ message: 'Invalid Data' });
        }

        const employee = await prisma.employee.findFirst({
            where: { Employee_Pnum },
        });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const passwordMatch = await bcrypt.compare(password, employee.hashedPassword);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.status(200).json({ message: 'Login successful', employee });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({
            message: 'Server Error',
        });
    }
}
