import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { Startdate, Enddate, Category_Id, Treatment_Id, Doctor_Id, Patient_Id, Description, Employee_Id } = req.body;

        // Check if required fields are provided
        if (!Startdate || !Enddate || !Category_Id || !Treatment_Id || !Doctor_Id || !Patient_Id) {
            return res.status(400).json({ error: 'All required fields (Startdate, Enddate, Category_Id, Doctor_Id, Patient_Id) must be provided.' });
        }

        // Convert start and end dates to Date objects
        const startDate = new Date(Startdate);
        const endDate = new Date(Enddate);

        // Check if the appointment is in the past
        const currentDate = new Date();
        if (startDate < currentDate || endDate < currentDate) {
            return res.status(400).json({ error: 'Appointments cannot be created for past times.' });
        }

        // Check if there's any overlapping appointment
        const overlappingAppointment = await prisma.appointment.findFirst({
            where: {
                AND: [
                    {
                        Startdate: {
                            lte: endDate, // Check if the new appointment ends after the start of the existing appointment
                        },
                    },
                    {
                        Enddate: {
                            gte: startDate, // Check if the new appointment starts before the end of the existing appointment
                        },
                    },
                ],
            },
        });

        if (overlappingAppointment) {
            return res.status(400).json({ error: 'Another appointment exists between the provided start and end times.' });
        }

        // Fetch necessary data from the database
        const waitingStatus = await prisma.status.findFirst({
            where: {
                Status_Id: '663b4c91f1ac87f9c33aad2d',
            },
        });

        const employee = await prisma.employee.findFirst({
            where: {
                Employee_Id: '664480efb257c125d595768d',
            },
        });

        if (!waitingStatus) {
            return res.status(500).json({ error: 'Status "waiting" not found.' });
        }

        if (!employee) {
            return res.status(500).json({ error: 'Employee not found.' });
        }

        // Create the appointment
        const createdAppointment = await prisma.appointment.create({
            data: {
                Startdate: startDate,
                Enddate: endDate,
                Category_Id,
                Treatment_Id,
                Doctor_Id,
                Patient_Id,
                Description,
                Employee_Id: employee.Employee_Id,
                Status_id: waitingStatus.Status_Id,
            },
        });

        return res.status(201).json({ message: 'Appointment created successfully', appointment: createdAppointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
