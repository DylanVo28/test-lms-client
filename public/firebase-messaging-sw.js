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
      apiKey: 'AIzaSyBU41qXUPYVYEPgeGpp0MU66Zgw9D8zh1Q',
      authDomain: 'storage-testing-6d416.firebaseapp.com',
      projectId: 'storage-testing-6d416',
      storageBucket: 'storage-testing-6d416.appspot.com',
      messagingSenderId: '984782636729',
      appId: '1:984782636729:web:bd2d89ea8f2c987d3a3d68',
      measurementId: 'G-LB7PRTMNNQ',
    };

    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log(payload, 'payload');

      // const { title, body } = payload.notification;

      // self.registration.showNotification(title, {
      //   body,
      //   icon: '/favicon.png',
      //   data: payload.data,
      // });
    });

    self.addEventListener('push', function (event) {
      const message = event.data.json();
      console.log(message, 'message');

      const notificationTitle = message.notification?.title || '';
      const notificationOptions = {
        body: message.notification?.body || '',
        badge: '/favicon.png',
        icon: '/favicon.png',
        data: message?.data,
      };

      const notificationPromise = self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
      event.waitUntil(notificationPromise);
    });

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
