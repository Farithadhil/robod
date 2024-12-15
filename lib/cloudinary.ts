import { v2 as cloudinary } from 'cloudinary';
import { NextApiRequest, NextApiResponse } from 'next'; 


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { image } = req.body;

    const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'projects',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    });

    res.status(200).json({ imageUrl: uploadResponse.secure_url });
}
