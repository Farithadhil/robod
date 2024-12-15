// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();

//     // Save the project to your database
//     // (Replace the following line with actual database logic)
//     console.log('Received data:', data);

//     return NextResponse.json({ success: true, message: 'Project created successfully' }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating project:', error);
//     return NextResponse.json({ success: false, message: 'Failed to create project' }, { status: 500 });
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import db from '../../../lib/db';
import cloudinary from '../../../lib/cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const session = await getSession({ req });

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { title, description, tags, categories } = req.body;

        try {
            // Process image upload
            const imageFile = req.body.image; // Assuming image comes as FormData
            const uploadResponse = await cloudinary.uploader.upload(imageFile, {
                folder: 'projects',
            });

            // Save project in the database
            await db.query(
                'INSERT INTO projects (user_id, title, description, tags, categories, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                [session.user.id, title, description, tags, categories, uploadResponse.secure_url]
            );

            res.status(201).json({ message: 'Project created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
