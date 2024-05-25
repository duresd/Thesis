import { Select } from '@mantine/core';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }

    try {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Patient_Id is required and must be a string' });
        }

        const histories = await prisma.patient_history.findMany({
            where: {
                Appointment: {
                    Patient_Id: id,
                },
            },
            include: {
                Appointment: {
                    select: {
                        Appointment_Id: true,
                        Startdate: true,
                        Enddate: true,
                        Patient: {
                            select: {
                                Patient_Name: true,
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
                        Doctor: {
                            select: {
                                Doctor_Name: true,
                            },
                        },
                        Description: true,
                    },
                }, // Include appointment details if needed
            },
        });

        if (!histories || histories.length === 0) {
            return res.status(404).json({ error: 'No patient history found for the given Patient_Id' });
        }

        res.status(200).json(histories);
    } catch (error) {
        console.error('Error fetching patient history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
