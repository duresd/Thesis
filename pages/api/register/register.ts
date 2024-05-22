import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const { Employee_Name, Employee_Pnum, password, Role } = req.body;

        if (!Employee_Name || !Employee_Pnum || !password || !Role) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const alreadyExist = await prisma.employee.findFirst({
            where: {
                Employee_Pnum: Employee_Pnum,
            },
        });

        if (!alreadyExist?.Employee_Id) {
            return new NextResponse('Employee already exist', { status: 404 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const createdEmployee = await prisma.employee.create({
            data: {
                Employee_Name,
                Employee_Pnum,
                hashedPassword,
                Role,
            },
        });

        return res.status(201).json({ createdEmployee });
    } catch (error) {
        console.error('Error creating epmloyee:', error);
        return res.status(500).json({
            message: 'Server Error',
        });
    }
}
