import NoData from '@/components/ListCourse/NoData';
import Loading from '@/components/UI/Loading';
import Text from '@/components/UI/Text';
import { Avatar, Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ListNotification = ({
  listNotification = [],
  handleReadNotification,
  loading,
}: any) => {
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsInit(true);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col gap-2 pr-2 scroll-custom min-h-[300px] max-h-[300px] overflow-auto">
      {listNotification?.length > 0 &&
        listNotification?.map((item: any, index: number) => {
          return (
            <div
              key={index}
              onClick={() => handleReadNotification(item)}
              className={clsx(
                'p-2 flex rounded  cursor-pointer transition-all hover:bg-black-4 justify-between items-center gap-4',
                {
                  ['bg-black-4']: !item?.read,
                }
              )}
            >
              <div className="flex items-center gap-4">
                <div>
                  {item?.data?.avatar ? (
                    <Image
                      src={item?.data?.avatar}
                      className="w-10 h-10"
                      width={40}
                      height={40}
                      alt="avtar"
                      layout="contain"
                    />
                  ) : (
                    <Avatar src="" className="w-10 h-10" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Tooltip
                    radius="md"
                    classNames={{
                      content: 'p-2 rounded',
                    }}
                    content={item?.body}
                  >
                    <a>
                      <Text
                        type="font-16-500"
                        className="truncate max-w-[430px]"
                      >
                        {item?.body}
                      </Text>
                    </a>
                  </Tooltip>

                  <Text type="font-14-400" className="text-secondary-500">
                    {dayjs(item?.createdAt).format('DD/MM/YYYY hh:mm A')}
                  </Text>
                </div>
              </div>

              <div>
                {!item?.read && (
                  <div
                    className="w-2 h-2 rounded-full bg-error-1
                  "
                  />
                )}
              </div>
            </div>
          );
        })}

      {((loading && listNotification?.length === 0) || !isInit) && (
        <div className="min-h-[300px]">
          <div className="pt-10">
            <Loading />
          </div>
        </div>
      )}

      {listNotification?.length === 0 && !loading && isInit && (
        <div className="pb-10">
          <NoData text="No notification" />
        </div>
      )}
    </div>
  );
};
export default ListNotification;
