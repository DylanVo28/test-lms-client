/* eslint-disable unicorn/no-null */
/* eslint-disable require-await */
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { useRequest } from 'ahooks';
import { useAtom } from 'jotai';
import { notificationAtom } from './notification';
import { getAccessToken } from '../auth';

export interface INotification {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  type?:
    | 'NEW_PROJECT'
    | 'AVAILABLE_PROJECT'
    | 'UNAVAILABLE_PROJECT'
    | 'EDIT_PROJECT'
    | 'CLOSE_PROJECT'
    | 'OVERDUE_PROJECT'
    | 'NEW_PROPOSAL'
    | 'EDIT_PROPOSAL'
    | 'INVITE_GROUP'
    | 'JOIN_GROUP'
    | 'LEAVE_GROUP'
    | 'REMOVE_GROUP';
  created_at: string;
}

export const getAllNotification = (filters?: any) => {
  const params = {
    page: filters?.page || 1,
    pageSize: filters?.pageSize || 10,
    userType: filters?.userType,
    lang: filters?.lang,
  };

  if (!params?.userType) {
    delete params.userType;
  }

  return privateRequest(request.get, API_PATH.NOTIFICATION, { params });
};

const readNotification = (id: string) => {
  return privateRequest(request.post, API_PATH.READ_NOTIFICATION(id), {});
};

export const useGetNotification = (options?: any) => {
  return useRequest(
    async (filters?: any) => {
      const isLogin = getAccessToken();

      if (isLogin) {
        return getAllNotification(filters);
      }

      return null;
    },
    {
      manual: true,
      ...options,
    }
  );
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useAtom(notificationAtom);

  // setNotifications((prev: any) => {
  //   console.log(prev, 'prev');

  //   const newPrev = prev?.;

  //   return {
  //     content: {
  //       data: newPrev?.content?.data?.map((item: any) => ({
  //         ...item,
  //         is_read: true,
  //       })),
  //     },
  //   };
  // });

  const requestReadNotification = useRequest(readNotification, {
    manual: true,
    onSuccess: (res) => {
      const newData = notifications?.content?.map((item?: any) => {
        if (item?.id === res?.data?.id) {
          return {
            ...item,
            read: true,
          };
        } else return item;
      });

      // toast.success('Successfully');

      setNotifications({
        ...notifications,
        totalCount: notifications?.totalCount - 1,
        content: newData,
      });
    },
  });

  const requestCheckHasNotification = useRequest(
    async () => {
      const token = getAccessToken();

      const params = {
        read: false,
      };

      if (token) {
        return privateRequest(request.get, API_PATH.GET_COUNT_NOTIFICATION, {
          params,
        });
      }

      return {};
    },
    {
      manual: true,
      debounceWait: 350,
      onSuccess: (res: any) => {
        setNotifications((prev: any) => {
          const newPrev = { ...prev };
          return {
            ...newPrev,
            totalCount: res?.data,
          };
        });
      },
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  const requestGetNotification = useGetNotification({
    onSuccess: (res: any) => {
      if (!res) {
        return;
      }

      setNotifications((prev: any) => {
        const newPrev = { ...prev };

        return {
          ...newPrev,
          content: res?.data,
        };
      });
    },
  });

  // const onLoadmoreNotification = async (d: any) => {
  //   try {
  //     const r: any = await requestGetNotificationModal.runAsync(d?.nextId || 1, 10);

  //     return {
  //       list: r?.data,
  //       nextId: r?.page >= r?.total_page ? undefined : r?.page + 1,
  //     };
  //   } catch {}
  // };

  return {
    notifications,
    requestCheckHasNotification,
    requestGetNotification,
    setNotifications,
    requestReadNotification,
    loading: requestGetNotification?.loading,
  };
};
