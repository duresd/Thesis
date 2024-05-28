import prisma from '@/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing ID parameter' });
    }

    try {
        const deletedTreatment = await prisma.treatment.delete({
            where: { Treatment_Id: id },
        });

        res.status(200).json({ message: 'Treatment deleted successfully', deletedTreatment });
    } catch (error) {
        console.error('Error deleting Treatment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
