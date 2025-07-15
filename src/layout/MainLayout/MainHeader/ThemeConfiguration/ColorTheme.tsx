import Text from '@/components/UI/Text';
import React from 'react';
import { useTheme } from '@/store/theme/useTheme';
import { set } from 'video.js/dist/types/tech/middleware';
import { ImodeTheme } from '@/store/theme/theme';
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
    id: 6,
    color: '#B5E1C7',
    theme: 'lightGreen',
  },
  {
    id: 4,
    color: '#E2DDBE',
    theme: 'lightYellow',
  },
  {
    id: 5,
    color: '#E5E5D0',
    theme: 'lightBeige',
  },

  {
    id: 3,
    color: '#E5DBDB',
    theme: 'lightPink',
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
    id: 3,
    color: '#036',
    theme: 'navyBule',
  },
  {
    id: 5,
    color: '#201816',
    theme: 'chestnutBrown',
  },
  {
    id: 4,
    color: '#1F1F1F',
    theme: 'charcoalGray',
  },
  {
    id: 2,
    color: '#333',
    theme: 'darkGray',
  },
];

const ColorTheme = ({
  handleChangeValueColor,
  valueColorTheme,
}: {
  handleChangeValueColor: any;
  valueColorTheme: any;
}) => {
  const handleChangeThemeColor = (item: any, modeTheme: ImodeTheme) => {
    handleChangeValueColor(item, modeTheme);
    // setTheme({
    //   ...theme,
    //   color: item?.theme,
    //   modeTheme,
    // });
  };

  return (
    <div>
      <Text className="text-[18px] text-white font-semibold mb-[16px]">
        {'Color theme'}
      </Text>
      <div className="p-[20px] bg-gray-50 border border-[#00000033] rounded-[4px]">
        <div className="flex flex-col gap-3">
          <Text type="font-18-600" className="text-white">
            {'Background'}
          </Text>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <Text type="font-16-700" className="text-white">
                {'Light color'}
              </Text>
              <div className="flex items-center gap-4">
                {DATA_COLOR_LIGHT?.map((item) => {
                  return (
                    <div
                      className={clsx('p-2 rounded-full', {
                        ['border-2 border-main']:
                          valueColorTheme.color === item?.theme,
                      })}
                    >
                      <div
                        onClick={() =>
                          handleChangeThemeColor(item, ImodeTheme.LIGHT_MODE)
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
                {'Dark color'}
              </Text>
              <div className="flex items-center gap-4">
                {DATA_COLOR_DARK?.map((item) => {
                  return (
                    <div
                      className={clsx('p-2 rounded-full', {
                        ['border-2 border-main']:
                          valueColorTheme.color === item?.theme,
                      })}
                    >
                      <div
                        onClick={() =>
                          handleChangeThemeColor(item, ImodeTheme.DARK_MODE)
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
        </div>
      </div>
    </div>
  );
};

export default ColorTheme;
