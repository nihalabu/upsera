// import { getFirestore } from '@/lib/firebaseAdmin';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, businessName, businessType, message } = req.body;

        // Validate required fields
        if (!name || !email || !businessName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // When Firebase is configured, uncomment to save leads:
        // const db = getFirestore();
        // await db.collection('leads').add({
        //   name,
        //   email,
        //   businessName,
        //   businessType: businessType || '',
        //   message: message || '',
        //   createdAt: new Date().toISOString(),
        //   status: 'new',
        // });

        // For now, just log the lead (in production, save to Firebase)
        console.log('New lead received:', { name, email, businessName, businessType, message });

        return res.status(200).json({
            success: true,
            message: 'Lead submitted successfully'
        });
    } catch (error) {
        console.error('Error saving lead:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
