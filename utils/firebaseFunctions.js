const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://roccovideo-40099-default-rtdb.asia-southeast1.firebasedatabase.app"
    databaseURL : "https://roccovideo-93a03-default-rtdb.asia-southeast1.firebasedatabase.app"
});


module.exports.sendPushNotification = async (fcmToken, title, body) => {
    try {
        const message = {
            notification: {
                title: title,
                body: body,
            },
            token: fcmToken,
        };

        console.log('firebase push notification', message)

        const response = await admin.messaging().send(message);  
        // console.log('response', response);
        console.log('Successfully sent notification:', response);
        return response;
    } catch (error) {
        // console.error('Error sending message:', error);
        console.error('Error sending message:', error.code, error.message);
        throw error;
    }
};

const CHUNK_SIZE = 500; // Max tokens per batch for Firebase

// Function to send push notifications in batches of 500
module.exports.sendBulkPushNotification = async (fcmTokens, title, body) => {
    try {
        // Split tokens into chunks of 500
        for (let i = 0; i < fcmTokens.length; i += CHUNK_SIZE) {
            const tokenBatch = fcmTokens.slice(i, i + CHUNK_SIZE);
            const message = {
                notification: { title, body },
                tokens: tokenBatch,
            };

            const response = await admin.messaging().sendEachForMulticast(message);
         
        }
    } catch (error) {
        console.error("Error sending push notification:", error);
        throw error;
    }
};

module.exports.sendBulkPushNotificationCustom = async (fcmTokens, title, body,data) => {
    try {
        // Split tokens into chunks of 500
        for (let i = 0; i < fcmTokens.length; i += CHUNK_SIZE) {
            const tokenBatch = fcmTokens.slice(i, i + CHUNK_SIZE);
            const message = {
                notification: { title, body },
                data : data,
                tokens: tokenBatch,
            };

            const response = await admin.messaging().sendEachForMulticast(message);
           
        }
    } catch (error) {
        console.error("Error sending push notification:", error);
        throw error;
    }
};