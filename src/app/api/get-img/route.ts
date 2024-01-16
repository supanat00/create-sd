'use server'
// pages/api/get-latest-image-data.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        // Connect to the database
        await prisma.$connect();

        // Fetch the latest image data from the database
        const latestImageData = await prisma.Postering.findFirst({
            orderBy: { id: 'desc' }, // Order by id in descending order to get the latest entry
        });

        // Check if there is any data
        if (!latestImageData) {
            return new Response('No image data found', { status: 404 });
        }

        // Get the 'cloudinaryUrl' from the latestImageData
        const cloudinaryUrl = latestImageData.photo;

        // Create a Response with cache control headers
        const response = new Response(JSON.stringify({ cloudinaryUrl }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, must-revalidate', // Disable caching
            },
        });

        return response;
    } catch (error) {
        console.error('Error fetching image data:', error);
        return new Response('Internal Server Error', { status: 500 });
    } finally {
        // Disconnect from the database
        await prisma.$disconnect();
    }
}
