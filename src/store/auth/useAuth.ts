/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable require-await */
import { useRequest } from 'ahooks';
import { useRouter } from 'next/router';
import request from 'umi-request';

import { PREFIX_API } from '@/api/request';
import { API_PATH } from '@/api/constant';
import { firebaseCloudMessaging } from '@/firebase/firebase';
import { getAccessToken } from '.';

export const useAuth = () => {
  const accessToken = getAccessToken();
  const requestUpdateFcmToken = useRequest(
    async (token: any) => {
      const fcmToken = await firebaseCloudMessaging.tokenInLocalForage();

      return request.post(`${PREFIX_API}${API_PATH.FCM_TOKEN}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          fcmToken: fcmToken,
        },
      });
    },
    {
      manual: true,
    }
  );

  return {
    requestUpdateFcmToken,
    isLogin: !!accessToken,
  };
};
