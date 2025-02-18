import Text from '@/components/UI/Text';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { useTheme } from '@/store/theme/useTheme';
import { set } from 'video.js/dist/types/tech/middleware';
import { IColorMode } from '@/store/theme/theme';
import clsx from 'clsx';

const DATA_COLOR_LIGHT = [
  {
    id: 1,
    color: '#fff',
    theme: 'white',
  },
  {
    id: 2,
    color: '#A2DFF7',
    theme: 'skyBlue',
  },
  {
    id: 3,
    color: '#FAE7F4',
    theme: 'lightPink',
  },
  {
    id: 4,
    color: '#FFF3B0',
    theme: 'lightYellow',
  },
  {
    id: 5,
    color: '#F5F5DC',
    theme: 'lightBeige',
  },
  {
    id: 6,
    color: '#D3F8E2',
    theme: 'lightGreen',
  },

  // {
  //   id: 5,
  //   color: '#FFFFFF',
  // },
];

const DATA_COLOR_DARK = [
  {
    id: 1,
    color: '#000',
    theme: 'black',
  },
  {
    id: 1,
    color: '#0A0F15',
    theme: 'graphite',
  },
  {
    id: 2,
    color: '#333',
    theme: 'darkGray',
  },
  {
    id: 3,
    color: '#036',
    theme: 'navyBule',
  },
  {
    id: 4,
    color: '#1F1F1F',
    theme: 'charcoalGray',
  },
  {
    id: 5,
    color: '#2B1B17',
    theme: 'chestnutBrown',
  },
];

const ColorTheme = ({
  onChangeColor,
  dataColor,
}: {
  onChangeColor: (value: string) => void;
  dataColor: string;
}) => {
  const { t } = useTranslation('common');
  const { theme, setTheme } = useTheme();

  const handleChangeThemeColor = (item: any, colorMode: IColorMode) => {
    setTheme({
      ...theme,
      color: item?.theme,
      colorMode,
    });
  };

  console.log(theme, 'theme');

  return (
    <div>
      <Text className="text-[18px] font-semibold mb-[16px]">
        {t('Color theme')}
      </Text>
      <div className="p-[20px] bg-[#242A30] border border-[#00000033] rounded-[4px]">
        <div className="flex flex-col gap-3">
          <Text type="font-18-600" className="text-white">
            {t('Background')}
          </Text>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <Text type="font-16-700" className="text-white">
                {t('Light color')}
              </Text>
              <div className="flex items-center gap-4">
                {DATA_COLOR_LIGHT?.map((item) => {
                  return (
                    <div
                      className={clsx('p-2 rounded-full', {
                        ['border-2 border-main']: theme.color === item?.theme,
                      })}
                    >
                      <div
                        onClick={() =>
                          handleChangeThemeColor(item, IColorMode.LIGHT_MODE)
                        }
                        className="w-[30px] p-2 h-[30px] cursor-pointer rounded-full"
                        style={{ background: item?.color }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Text type="font-16-700" className="text-white">
                {t('Dark color')}
              </Text>
              <div className="flex items-center gap-4">
                {DATA_COLOR_DARK?.map((item) => {
                  return (
                    <div
                      className={clsx('p-2 rounded-full', {
                        ['border-2 border-main']: theme.color === item?.color,
                      })}
                    >
                      <div
                        onClick={() =>
                          handleChangeThemeColor(item, IColorMode.LIGHT_MODE)
                        }
                        className="w-[30px] h-[30px] cursor-pointer rounded-full"
                        style={{ background: item?.color }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* <div className="grid grid-cols-2 gap-[16px] h-fit">
            {presetColors.map((color) => (
              <div
                onClick={() => onSelectColor(color)}
                key={color}
                className={`w-[30px] h-[30px] rounded-full cursor-pointer ${
                  valueColor === color ? 'border-2 border-white' : ''
                }`}
                style={{ background: color }}
              />
            ))}
          </div> */}
        </div>
        {/* <div className="flex gap-2 mt-4 items-center">
          <SelectCustom
            className="w-[40%] text-[12px] h-full bg-transparent"
            value={typeColor}
            onChange={onChangeTypeColor}
            options={typeColors}
          />
          <InputText
            className="w-full text-[12px]"
            value={valueColor}
            onChange={onChangeValueColor}
          />
        </div> */}
      </div>
    </div>
  );
};

export default ColorTheme;
