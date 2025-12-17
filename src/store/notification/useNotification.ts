/* eslint-disable unicorn/no-null */
/* eslint-disable require-await */
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { useRequest } from 'ahooks';
import { useAtom } from 'jotai';
import { useRef } from 'react';
import { notificationAtom } from './notification';
import { getAccessToken } from '../auth';
import { useQueries, useQueryClient } from '@tanstack/react-query';

export enum TAB_NOTIFICATION {
  VIEW_ALL = 'VIEW_ALL',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
}

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

export const useNotificationTabs = (isOpen: boolean, tab: TAB_NOTIFICATION) => {
  const token = getAccessToken();

  const queries = useQueries({
    queries: [
      {
        queryKey: ['notifications', TAB_NOTIFICATION.VIEW_ALL],
        queryFn: async () => {
          const res = await getAllNotification({ page: 1, pageSize: 50, userType: '' });
          return res?.data || [];
        },
        enabled: Boolean(token && isOpen),
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      {
        queryKey: ['notifications', TAB_NOTIFICATION.INSTRUCTOR],
        queryFn: async () => {
          const res = await getAllNotification({
            page: 1,
            pageSize: 50,
            userType: TAB_NOTIFICATION.INSTRUCTOR,
          });
          return res?.data || [];
        },
        enabled: Boolean(token && isOpen),
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      {
        queryKey: ['notifications', TAB_NOTIFICATION.STUDENT],
        queryFn: async () => {
          const res = await getAllNotification({
            page: 1,
            pageSize: 50,
            userType: TAB_NOTIFICATION.STUDENT,
          });
          return res?.data || [];
        },
        enabled: Boolean(token && isOpen),
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    ],
  });

  const listByTab = () => {
    if (tab === TAB_NOTIFICATION.VIEW_ALL) return (queries[0]?.data as any[]) || [];
    if (tab === TAB_NOTIFICATION.INSTRUCTOR) return (queries[1]?.data as any[]) || [];
    return (queries[2]?.data as any[]) || [];
  };

  const isLoadingTabs = queries.some((q) => q.isLoading || q.isFetching);

  return {
    queries,
    listByTab,
    isLoadingTabs,
  };
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
  const queryClient = useQueryClient();
  const fetchingCountRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  const COUNT_CACHE_TIME = 1000 * 30; // 30 seconds cache
  const requestReadNotification = useRequest(readNotification, {
    manual: true,
    onSuccess: (res) => {
      const readId = res?.data?.id;

      if (readId) {
        const updateList = (oldData: any[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((item) =>
            item?.id === readId
              ? {
                  ...item,
                  read: true,
                  is_read: true,
                }
              : item
          );
        };

        // Update all notification tab caches
        queryClient.setQueryData(['notifications', TAB_NOTIFICATION.VIEW_ALL], updateList);
        queryClient.setQueryData(['notifications', TAB_NOTIFICATION.INSTRUCTOR], updateList);
        queryClient.setQueryData(['notifications', TAB_NOTIFICATION.STUDENT], updateList);
      }

      setNotifications({
        ...notifications,
        totalCount: notifications?.totalCount - 1,
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
      onSuccess: (res: any) => {
        setNotifications((prev: any) => {
          const newPrev = { ...prev };
          return {
            ...newPrev,
            totalCount: res?.data,
          };
        });
        lastFetchTimeRef.current = Date.now();
        fetchingCountRef.current = false;
      },
      onError: (err: any) => {
        fetchingCountRef.current = false;
      },
    }
  );

  // Wrapper function to prevent duplicate calls
  const runCheckHasNotification = () => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    
    // Prevent duplicate calls: if already fetching or within cache time
    if (fetchingCountRef.current || timeSinceLastFetch < COUNT_CACHE_TIME) {
      return;
    }

    fetchingCountRef.current = true;
    requestCheckHasNotification?.run();
  };

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


  return {
    notifications,
    requestCheckHasNotification: {
      ...requestCheckHasNotification,
      run: runCheckHasNotification,
    },
    requestGetNotification,
    setNotifications,
    requestReadNotification,
    loading: requestGetNotification?.loading,
  };
};
