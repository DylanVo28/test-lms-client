import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from '@nextui-org/react';
import React, { useState } from 'react';
import ThemeIcon from './ThemeIcon';
import CloseIcon from './CloseIcon';
import Text from '@/components/UI/Text';
import { RgbaColorPicker, RgbaColor } from 'react-colorful';
import SelectCustom from '@/components/UI/SelectCustom';
import InputText from '@/components/UI/InputText';

const presetColors = [
  '#CD006C',
  '#EC7F00',
  '#74CA00',
  '#21A988',
  '#45B5EA',
  '#8125A2',
  '#F6F2F2',
  '#05070A',
];

const CustomLogoAndTheme = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [color, setColor] = useState<RgbaColor>({ r: 0, g: 0, b: 0, a: 0 });
  const onChange = (color: RgbaColor) => {
    setColor(color);
  };
  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        className="bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10 bg-[#02A6C2]"
      >
        <ThemeIcon />
      </Button>

      <Drawer
        className="w-[499px]"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        closeButton={<></>}
      >
        <DrawerContent className="p-[24px] flex flex-col gap-[32px]">
          {(onClose) => (
            <>
              <DrawerHeader className="flex justify-between items-center gap-1 p-0">
                <span className="text-[28px] font-bold leading-[150%]">
                  Theme Configuration
                </span>
                <CloseIcon onClick={onClose} className={'cursor-pointer'} />
              </DrawerHeader>
              <Divided />

              <div className="flex flex-col gap-[32px] p-0">
                <div>
                  <Text className="text-[18px] font-semibold mb-[16px]">
                    Edit logo
                  </Text>
                  <p className="text-md text-[#ffffff7f] mb-[8px]">
                    Minimum 200x200 pixels, Maximum 3000x3000 pixels
                  </p>
                  <div className="p-[20px] bg-[#242A30] rounded-[4px] border border-[#00000033]">
                    <div className="w-full h-[153px] flex flex-col items-center justify-center gap-[16px] bg-[#181F25] rounded-[4px] ">
                      <div className="text-[#ffffff7f] whitespace-nowrap">
                        JPEG, PNG or JPG . Max 10mb.
                      </div>
                      <Button className="text-base font-semibold leading-[24px] capitalize w-[154px] h-[40px] px-[8px] rounded-[4px] bg-[#ffffff19] text-white border border-[#02A6C2]">
                        Choose file
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Text className="text-[18px] font-semibold mb-[16px]">
                    Color theme
                  </Text>

                  <div className="flex gap-[16px]">
                    <div>
                      <div className="custom-color-picker">
                        <RgbaColorPicker onChange={onChange} color={color} />
                      </div>{' '}
                      <div className="flex gap-4 mt-4">
                        <SelectCustom
                          className="w-full text-[12px]"
                          value={'light'}
                          options={[{ key: 'light', label: 'Light' }]}
                        />
                        <InputText
                          className="w-full text-[12px]"
                          value={'100'}
                          type="number"
                        />
                        <InputText
                          className="w-full"
                          value={'100'}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-[16px] w-full h-fit">
                      {presetColors.map((color) => (
                        <div
                          key={color}
                          className="w-[30px] h-[30px] rounded-full cursor-pointer"
                          style={{ background: color }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

const Divided = () => (
  <div className="w-full mx-auto h-[1px] bg-[#2B3032] px-[16px]" />
);

export default CustomLogoAndTheme;
