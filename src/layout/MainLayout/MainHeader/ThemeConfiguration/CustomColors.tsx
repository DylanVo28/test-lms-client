import React from 'react';
import Text from '@/components/UI/Text';
import InputText from '@/components/UI/InputText';
import type { CustomColors } from '@/store/theme/theme';

interface CustomColorsProps {
  colors: CustomColors;
  onColorsChange: (colors: CustomColors) => void;
}

const CustomColors: React.FC<CustomColorsProps> = ({
  colors,
  onColorsChange,
}) => {
  const handleColorChange = (
    colorType: 'primary' | 'background' | 'card' | 'secondary' | 'text',
    value: string
  ) => {
    onColorsChange({
      ...colors,
      [colorType]: value,
    });
  };

  const colorFields = [
    {
      key: 'primary' as const,
      label: 'Primary Color',
      placeholder: '#02A6C2',
      description: 'Main brand color used for buttons and highlights',
    },
    {
      key: 'secondary' as const,
      label: 'Secondary Color',
      placeholder: '#6C757D',
      description: 'Secondary color for text and subtle elements',
    },
    {
      key: 'text' as const,
      label: 'Text Color',
      placeholder: '#ffffff',
      description: 'Text color for the application',
    },
    {
      key: 'background' as const,
      label: 'Background Color',
      placeholder: '#FFFFFF',
      description: 'Main background color for the application',
    },
    {
      key: 'card' as const,
      label: 'Card Color',
      placeholder: '#F8F9FA',
      description: 'Background color for cards and content areas',
    },
  ];

  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex);
  };

  return (
    <div className="flex flex-col gap-4">
      <Text className="text-[18px] font-semibold">Custom Colors</Text>

      <div className="p-[20px] bg-gray-50 border border-[#00000033] rounded-[4px] flex flex-col gap-6">
        {colorFields.map((field) => (
          <div key={field.key} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Text type="font-16-600" className="text-letter min-w-[120px]">
                {field.label}
              </Text>
            </div>

            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={
                  isValidHex(colors[field.key])
                    ? colors[field.key]
                    : field.placeholder
                }
                onChange={(e) => handleColorChange(field.key, e.target.value)}
                className="w-12 h-10 rounded cursor-pointer transition-colors"
                title={`Pick ${field.label.toLowerCase()}`}
                style={{
                  padding: '2px',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              />

              <InputText
                inputDefault
                value={colors[field.key]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleColorChange(field.key, e.target.value)
                }
                placeholder={field.placeholder}
                className="flex-1 rounded-[4px]"
              />
            </div>

            <Text type="font-12-400" className="text-gray-20">
              {field.description}
            </Text>

            {colors[field.key] && !isValidHex(colors[field.key]) && (
              <Text type="font-12-400" className="text-red-500">
                Please enter a valid hex color (e.g., #02A6C2)
              </Text>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomColors;
