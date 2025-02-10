import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from '@nextui-org/react';
import React, { useEffect } from 'react';
import ThemeIcon from './Icons/ThemeIcon';
import CloseIcon from './Icons/CloseIcon';
import ColorTheme from './ColorTheme';
import EditLogo from './EditLogo';
import Languages from './Languages';

const CustomLogoAndTheme = ({
  setUrlLogo,
}: {
  setUrlLogo: (value: string) => void;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isTheme, setIsTheme] = React.useState(false);
  const [color, setColor] = React.useState('');
  const [langs, setLangs] = React.useState<string[]>([]);
  const [logo, setLogo] = React.useState<string>('');

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
    document.documentElement.style.setProperty('--main-color', color);
    if (color) localStorage.setItem('main-color', color);
    if (logo) localStorage.setItem('logo', logo);
    setUrlLogo(logo);
    setIsTheme(true);
    localStorage.setItem('isTheme', 'true');
  };

  useEffect(() => {
    const savedColor = localStorage.getItem('main-color');
    const savedLogo = localStorage.getItem('logo');
    const savedIsTheme = localStorage.getItem('isTheme');
    if (savedIsTheme && savedIsTheme === 'true') setIsTheme(true);
    if (savedLogo) setLogo(savedLogo);
    if (savedColor) {
      setColor(savedColor);
      document.documentElement.style.setProperty('--main-color', savedColor);
    }
  }, []);

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        className={`${
          isTheme ? 'bg-main' : 'bg-gray'
        } border-1 border-gray-10 rounded-[4px] w-10 h-10`}
      >
        <ThemeIcon />
      </Button>

      <Drawer
        className="w-[499px] z-[9999]"
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
                    className="w-fit px-[24px] bg-main text-white font-semibold py-[10px] rounded-[4px] hover:bg-cyan-400 transition"
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

const Divided = () => <div className="w-full border border-[#2B3032]" />;

export default CustomLogoAndTheme;
