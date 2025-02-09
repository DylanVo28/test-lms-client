import InputText from '@/components/UI/InputText';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import React, { useEffect, useState } from 'react';
import { RgbaColor, RgbaColorPicker } from 'react-colorful';

const presetColors = [
  '#CD006C',
  '#EC7F00',
  '#74CA00',
  '#21A988',
  '#02A6C2',
  '#8125A2',
  '#F6F2F2',
  '#05070A',
];

type Color = {
  r: number;
  g: number;
  b: number;
  a?: number;
};
type TypeColor = 'hex' | 'rgb' | 'rgba';

const typeColors = [
  {
    label: 'Hex',
    value: 'hex',
    key: 'hex',
  },
  {
    label: 'RGB',
    value: 'rgb',
    key: 'rgb',
  },
  {
    label: 'RGBA',
    value: 'rgba',
    key: 'rgba',
  },
];

function hexToRgba(hex: string, alpha: number = 1): RgbaColor {
  hex = hex.replace('#', '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b, a: alpha };
}

function rgbToRgba(rgb: string, alpha: number = 1): RgbaColor {
  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  const [r, g, b] = result.map(Number);
  return { r, g, b, a: alpha };
}

function rgbaStringToObject(rgba: string) {
  const result = rgba.match(/(\d+(\.\d+)?)/g);

  if (!result || result.length < 3) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  const [r, g, b, a = '1'] = result;

  return {
    r: parseInt(r, 10),
    g: parseInt(g, 10),
    b: parseInt(b, 10),
    a: parseFloat(a),
  };
}

function convertColor(color: Color, type: TypeColor) {
  const { r, g, b, a = 1 } = color;

  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const rgba = `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  switch (type) {
    case 'hex':
      return hex;
    case 'rgb':
      return rgb;
    case 'rgba':
      return rgba;
  }
}

const ColorTheme = ({
  onChangeColor,
}: {
  onChangeColor: (value: string) => void;
}) => {
  const [typeColor, setTypeColor] = useState<TypeColor>('hex');
  const [color, setColor] = useState<RgbaColor>({ r: 0, g: 0, b: 0, a: 0 });
  const [valueColor, setValueColor] = useState<string>(
    convertColor({ r: 0, g: 0, b: 0, a: 0 }, typeColor)
  );

  const onChange = (color: RgbaColor) => {
    setColor(color);
    setValueColor(convertColor(color, typeColor));
    onChangeColor(convertColor(color, typeColor));
  };

  const onChangeTypeColor = (e: any) => {
    setTypeColor(e.target.value);
    onChangeColor(convertColor(color, e.target.value));
    setValueColor(convertColor(color, e.target.value));
  };

  const onChangeValueColor = (e: any) => {
    const value = e.target.value;
    setValueColor(value);
    onChangeColor(value);
    switch (typeColor) {
      case 'hex':
        setColor(hexToRgba(value, 1));
      case 'rgb':
        setColor(rgbToRgba(value, 1));
        break;
      case 'rgba':
        setColor(rgbaStringToObject(value));
        break;
    }
  };

  const onSelectColor = (color: string) => {
    setValueColor(color);
    setTypeColor('hex');
    setColor(hexToRgba(color, 1));
    onChangeColor(convertColor(hexToRgba(color, 1), typeColor));
  };

  useEffect(() => {
    const savedColor = localStorage.getItem('main-color');
    if (savedColor) {
      setColor(hexToRgba(savedColor, 1));
    }
  }, []);

  return (
    <div>
      <Text className="text-[18px] font-semibold mb-[16px]">Color theme</Text>
      <div className="p-[20px] bg-[#242A30] border border-[#00000033] rounded-[4px]">
        <div className="text-base mb-[8px] font-semibold">Background</div>
        <div className="flex gap-[16px]">
          <div className="w-[80%]">
            <div className="custom-color-picker">
              <RgbaColorPicker onChange={onChange} color={color} />
            </div>{' '}
          </div>

          <div className="grid grid-cols-2 gap-[16px] h-fit">
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
          </div>
        </div>
        <div className="flex gap-2 mt-4 items-center">
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
          {/* <InputText className="w-full text-[12px]" value={'100%'} /> */}
        </div>
      </div>
    </div>
  );
};

export default ColorTheme;
