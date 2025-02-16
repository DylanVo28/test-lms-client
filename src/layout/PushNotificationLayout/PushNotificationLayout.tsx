import { useEffect } from 'react';

import { useDebounceFn } from 'ahooks';
import { getAccessToken } from '@/store/auth';
import { firebaseCloudMessaging } from '@/firebase/firebase';

const PushNotificationLayout = () => {
  // const { requestCheckHasNotification } = useNotifications();
  // const { reloadDataNotificationPopup } = useDelegateNotification();

  const { run: updateNoti } = useDebounceFn(
    () => {
      const isLogin = getAccessToken();
      if (!isLogin) {
        return;
      }
      // requestCheckHasNotification.run();
      // if (reloadDataNotificationPopup) {
      //   reloadDataNotificationPopup();
      // }
    },
    {
      wait: 300,
    }
  );

  useEffect(() => {
    (async () => {
      try {
        const token = await firebaseCloudMessaging.init();

        if (token) {
          firebaseCloudMessaging.onMessage(updateNoti);
        }
      } catch (error) {
        console.log({ error });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default PushNotificationLayout;
