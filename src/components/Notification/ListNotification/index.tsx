import Text from '@/components/UI/Text';
import { Avatar } from '@nextui-org/react';
import clsx from 'clsx';

const DATA_NOTIFICAITON = [
  {
    id: 1,
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: '03/05/2024 03:45 PM',
    isRead: true,
  },
  {
    id: 2,
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: '03/05/2024 03:45 PM',
    isRead: false,
  },
  {
    id: 3,
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: '03/05/2024 03:45 PM',
    isRead: true,
  },
  {
    id: 4,
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: '03/05/2024 03:45 PM',
    isRead: false,
  },
  {
    id: 5,
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: '03/05/2024 03:45 PM',
    isRead: true,
  },

  {
    id: 6,
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: '03/05/2024 03:45 PM',
    isRead: true,
  },
  {
    id: 7,
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: '03/05/2024 03:45 PM',
    isRead: true,
  },
  {
    id: 8,
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: '03/05/2024 03:45 PM',
    isRead: true,
  },
];

const ListNotification = () => {
  return (
    <div className="flex flex-col gap-2 pr-2 scroll-custom max-h-[330px] overflow-auto">
      {DATA_NOTIFICAITON?.map((item) => {
        return (
          <div
            key={item?.id}
            className={clsx(
              'p-2 flex rounded  cursor-pointer transition-all hover:bg-black-4 justify-between items-center gap-4',
              {
                ['bg-black-4']: !item?.isRead,
              }
            )}
          >
            <div className="flex items-center gap-4">
              <div>
                <Avatar src="" className="w-10 h-10" />
              </div>
              <div className="flex flex-col gap-1">
                <Text type="font-16-500" className="truncate max-w-[430px]">
                  {item?.title}
                </Text>
                <Text type="font-14-400" className="text-secondary-500">
                  {item?.date}
                </Text>
              </div>
            </div>

            <div>
              {!item?.isRead && (
                <div
                  className="w-2 h-2 rounded-full bg-error-1
                  "
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ListNotification;
