/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable no-undef */

if (typeof window === 'undefined') {
  importScripts(
    'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
  );
  importScripts(
    'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
  );

  try {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
    };

    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log(payload, 'payload');

      const { title, body } = payload.notification;

      self.registration.showNotification(title, {
        body,
        icon: '/favicon.png',
      });
    });

    self.addEventListener(
      'push',
      function (event) {
        const message = event.data.json();
        const notificationTitle = message.data?.title || '';
        const notificationOptions = {
          body: message.data?.content || '',
          badge: '/favicon.png',
          icon: '/favicon.png',
          data: message?.data,
        };

        const notificationPromise = self.registration.showNotification(
          notificationTitle,
          notificationOptions
        );
        event.waitUntil(notificationPromise);
      },
      false
    );

    self.addEventListener('notificationclick', function (event) {
      console.log(event, 'event');
      event.notification.close();
      // const project_id =  Number(event?.notification.data?.project_id);
      // let URL = ''
      // if (
      //   [
      //     TYPE_NOTIFICATION.NEW_PROJECT,
      //     TYPE_NOTIFICATION.LEAVE_GROUP,
      //     TYPE_NOTIFICATION.INVITE_GROUP,
      //     TYPE_NOTIFICATION.REMOVE_GROUP,
      //     TYPE_NOTIFICATION?.OVERDUE_PROJECT,
      //     TYPE_NOTIFICATION.EDIT_PROJECT,
      //     TYPE_NOTIFICATION.CLOSE_PROJECT,

      //   ].includes(event?.notification?.data?.type)
      // ) {
      //   URL = `/browser_project/${event?.notification?.data?.project_id}`
      // }
      // if (
      //   [
      //     TYPE_NOTIFICATION.AVAILABLE_PROJECT,
      //     TYPE_NOTIFICATION.UNAVAILABLE_PROJECT,
      //     TYPE_NOTIFICATION.JOIN_GROUP,
      //   ].includes(event?.notification?.data?.type)
      // ) {
      //   URL = `/my_project_post/${event?.notification?.data?.project_id}`
      // }

      // if (
      //   [TYPE_NOTIFICATION.NEW_PROPOSAL,
      //     TYPE_NOTIFICATION.EDIT_PROPOSAL].includes(event?.notification?.data?.type)
      // ) {
      //   URL = `/detail_proposal_project/${event?.notification?.data?.proposal_id}?project_id=${event?.notification?.data?.project_id}`
      // }
      // if(TYPE_NOTIFICATION?.OVERDUE_PROJECT) {
      //   console.log('r');
      //   URL = `/browser_project/${event?.notification?.data?.project_id}`
      // }

      let clickResponsePromise = Promise.resolve();
      clickResponsePromise = clients.openWindow(URL);

      event.waitUntil(Promise.all([clickResponsePromise]));
    });
  } catch (error) {
    console.log({ error });
  }
}
