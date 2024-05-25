import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

interface Appointment {
    Appointment_Id: string;
    Startdate: Date;
    Enddate: Date;
    Doctor: {
        Doctor_Name: string;
    };
    Patient: {
        Patient_Name: string;
        Phone_Num: string;
    };
    Category: {
        Category_Name: string;
    };
    Employee: {
        Employee_Name: string;
    };
    Status: {
        Status_Name: string;
    };
    Description: string;
    created_At: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    let { page = '1', limit = '10', sortBy = 'Startdate', sortOrder = 'asc' } = req.query;

    page = page.toString();
    limit = limit.toString();
    sortBy = sortBy.toString();
    sortOrder = sortOrder.toString();

    try {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const skip = (pageNumber - 1) * limitNumber;

        const appointments: Appointment[] = await prisma.appointment.findMany({
            select: {
                Appointment_Id: true,
                Startdate: true,
                Enddate: true,
                Doctor: {
                    select: {
                        Doctor_Name: true,
                    },
                },
                Patient: {
                    select: {
                        Patient_Name: true,
                        Phone_Num: true,
                    },
                },
                Category: {
                    select: {
                        Category_Name: true,
                    },
                },
                Treatment: {
                    select: {
                        Treatment_Name: true,
                    },
                },
                Employee: {
                    select: {
                        Employee_Name: true,
                    },
                },
                Status: {
                    select: {
                        Status_Name: true,
                    },
                },
                Description: true,
                created_At: true,
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
            take: limitNumber,
            skip: skip,
        });

        return res.status(200).json({ appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({
            message: 'Server Error',
        });
    }
}
