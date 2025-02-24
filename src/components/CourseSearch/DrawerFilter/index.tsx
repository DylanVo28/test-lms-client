import Text from '@/components/UI/Text';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from '@nextui-org/react';
import Image from 'next/image';
import { forwardRef, useImperativeHandle, useState } from 'react';
import FilterCourse from '../ListCourse/FilterCourse';
import { useTranslation } from 'next-i18next';

const DrawerFilter = (props: any, ref: any) => {
  const { setParams, params } = props;
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('common');

  const onVisible = () => {
    setVisible(!visible);
  };
  useImperativeHandle(ref, () => {
    return {
      onOpen: () => {
        setVisible(true);
      },
      onClose: () => setVisible(false),
    };
  });

  return (
    <Drawer
      radius="none"
      hideCloseButton
      size="full"
      classNames={{
        base: 'bgDrawer',
      }}
      isOpen={visible}
      onClose={onVisible}
    >
      <DrawerContent>
        <>
          <DrawerBody className="p-0">
            <div className="flex flex-col">
              <div className="flex p-4 items-center justify-between border-b-1 border-white-10">
                <Image
                  alt="logo"
                  width={125}
                  height={46}
                  className="cursor-pointer"
                  src={'/logo.png'}
                />
                <Image
                  onClick={onVisible}
                  src={'/images/ic-close.png'}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  alt=""
                />
              </div>
              <div className="py-6 px-4">
                <FilterCourse
                  onCloseModalFilter={onVisible}
                  isMobile
                  setParams={setParams}
                  params={params}
                />
              </div>
            </div>
          </DrawerBody>
        </>
      </DrawerContent>
    </Drawer>
  );
};
export default forwardRef(DrawerFilter);
