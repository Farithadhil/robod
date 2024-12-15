import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.query;

        await db.query('DELETE FROM projects WHERE id = ?', [id]);

        res.status(200).json({ message: 'Project deleted successfully' });
    }
}
