import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { userId } = req.query;

        const [projects] = await db.query(
            'SELECT * FROM projects WHERE user_id = ?',
            [userId]
        );

        res.status(200).json(projects);
    }
}
