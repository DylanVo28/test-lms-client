/* eslint-disable require-await */
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getToken,
  getMessaging,
  onMessage,
  isSupported,
} from 'firebase/messaging';
import localforage from 'localforage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const FIREBASE_VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

// Initialize Firebase9
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const firebaseCloudMessaging = {
  tokenInLocalForage: async () => {
    const token = await localforage.getItem('fcm_token_client');
    return token;
  },
  removeFcmToken: async () => {
    await localforage.removeItem('fcm_token_client');
  },
  onMessage: async (onCallback: any) => {
    try {
      const messaging = getMessaging();

      onMessage(messaging, onCallback);
    } catch {}
  },

  init: async function () {
    try {
      let fcmToken = await this.tokenInLocalForage();
      console.log(fcmToken, 'fcmToken');

      if (fcmToken !== null) {
        return fcmToken;
      }

      const isSupport = await isSupported();

      if (!isSupport) {
        return isSupport;
      }

      const messaging = getMessaging(app);

      await Notification.requestPermission();

      fcmToken = await getToken(messaging, {
        vapidKey: FIREBASE_VAPID_KEY,
      });

      if (fcmToken) {
        // Send the token to your server and update the UI if necessary
        // save the token in your database
        localforage.setItem('fcm_token_client', fcmToken);
        console.log('fcm_token_client', fcmToken);
        return fcmToken;
      } else {
        // Show permission request UI
        console.log(
          'NOTIFICACION, No registration token available. Request permission to generate one.'
        );
      }
    } catch (error) {
      console.error(error);
    }
  },
};

export { firebaseCloudMessaging };
