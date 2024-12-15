import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, title, description, tags, categories, imageUrl } = req.body;

        await db.query(
            'UPDATE projects SET title = ?, description = ?, tags = ?, categories = ?, image_url = ? WHERE id = ?',
            [title, description, tags, categories, imageUrl, id]
        );

        res.status(200).json({ message: 'Project updated successfully' });
    }
}
