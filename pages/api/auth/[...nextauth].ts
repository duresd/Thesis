import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

import { getIronSession } from 'iron-session';
import { sessionOptions, sleep, defaultSession, SessionData } from '@/utils/auth';
import { C } from '@fullcalendar/core/internal-common';
import { Doctor, Employee } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    if (req.method == 'GET') {
        session.destroy();
        session.isLoggedIn = false;
        return res.status(200).json({
            message: 'Success logout',
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const { Employee_Pnum, password } = req.body;
        if (!Employee_Pnum || !password) {
            return res.status(422).json({ message: 'Нэвтрэх нэр нууц үгээ оруулна уу!' });
        }
        let isEmployee = true;

        let user: Doctor | Employee | null = await prisma.employee.findFirst({
            where: { Employee_Pnum },
        });

        if (!user) {
            isEmployee = false;
            user = await prisma.doctor.findFirst({
                where: { Doctor_Pnum: Employee_Pnum },
            });
            if (!user) {
                return res.status(404).json({ message: 'Нэвтрэх нэр буруу байна' });
            }
        }

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Нууц үг буруу байна' });
        }
        session.isLoggedIn = true;
        if (isEmployee) {
            session.username = user.Employee_Name;
            session.username = user.Employee_Pnum;
        } else {
            user.Employee_Name = user.Doctor_Name;
            session.username = user.Doctor_Name;
        }

        await session.save();
        await sleep(250);
        return res.status(200).json({ message: 'Амжилттай нэвтэрлээ', user });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({
            message: 'Алдаа гарлаа',
        });
    }
}
