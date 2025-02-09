import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from '@nextui-org/react';
import React from 'react';
import ThemeIcon from './Icons/ThemeIcon';
import CloseIcon from './Icons/CloseIcon';
import ColorTheme from './ColorTheme';
import EditLogo from './EditLogo';
import Languages from './Languages';

const CustomLogoAndTheme = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [color, setColor] = React.useState('');
  const [langs, setLangs] = React.useState<string[]>([]);
  const [logo, setLogo] = React.useState('');

  const onChangeColor = (color: string) => {
    setColor(color);
  };

  const onChangeLangs = (values: string[]) => {
    setLangs(values);
  };

  const onChangeLogo = (logo: string) => {
    setLogo(logo);
  };

  const onSave = () => {
    console.log({ color, langs, logo });
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
        <DrawerContent className="p-[24px] flex flex-col gap-[32px] bg-[#24292fe5] backdrop-blur-xl">
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
                <EditLogo onChangeLogo={onChangeLogo} />
                <ColorTheme onChangeColor={onChangeColor} />
                <Languages onChangeLangs={onChangeLangs} />
                <div className="flex justify-end">
                  <Button
                    onPress={onSave}
                    type="submit"
                    className="w-fit px-[24px] bg-[#02A6C2] text-white font-semibold py-[10px] rounded-[4px] hover:bg-cyan-400 transition"
                  >
                    Save
                  </Button>
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
  <div className="w-full border border-[#2B3032]" />
);

export default CustomLogoAndTheme;
