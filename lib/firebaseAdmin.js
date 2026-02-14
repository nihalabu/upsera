import admin from 'firebase-admin';

function getFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

    return admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

export function getFirestore() {
    const app = getFirebaseAdmin();
    return admin.firestore(app);
}

export default getFirebaseAdmin;
