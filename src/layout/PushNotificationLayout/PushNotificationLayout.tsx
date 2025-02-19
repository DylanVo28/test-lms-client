import { useEffect } from 'react';

import { useDebounceFn } from 'ahooks';
import { getAccessToken } from '@/store/auth';
import { firebaseCloudMessaging } from '@/firebase/firebase';
import { useNotifications } from '@/store/notification/useNotification';

const PushNotificationLayout = () => {
  const { requestCheckHasNotification } = useNotifications();

  const { run: updateNoti } = useDebounceFn(
    () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        return;
      }
      requestCheckHasNotification.run();
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
