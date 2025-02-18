import { atom, useAtom } from 'jotai';

export interface INotification {
  content: string;
  create_at: string;
  group: string;
  id: number;
  is_read: boolean;
  title: string;
  type: string;
}

export const notificationAtom = atom<any>({
  // isHaveNotification: false,
  // count: 0,
  // content: {
  //   data: [],
  // },
});

notificationAtom.debugLabel = '@notificationAtom';

export const useUpdateNotification = () => {
  const [, setNotifications] = useAtom(notificationAtom);

  const onUpdateCount = () => {
    setNotifications((prev: any) => {
      return {
        ...prev,
        count: prev?.count - 1,
      };
    });
  };

  return {
    onUpdateCount,
  };
};
