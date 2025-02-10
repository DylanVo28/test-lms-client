import { Button, Tooltip } from '@nextui-org/react';
import React from 'react';

const contents = [
  {
    key: 1,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    key: 2,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    key: 3,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

const Security = () => {
  return (
    <div className="flex flex-col gap-[32px] w-full box-border">
      <div className="text-[18px] font-bold">
        <sup className="text-[#FF3132]">*</sup> Upload File
      </div>

      <div className="flex flex-col gap-[16px]">
        {contents.map((item) => (
          <Checkbox key={item.key}>
            <Tooltip content={item.content}>
              <div className="w-full max-w-[797px] whitespace-nowrap text-ellipsis overflow-hidden text-base opacity-50">
                {item.content}
              </div>
            </Tooltip>
          </Checkbox>
        ))}
      </div>
      <Button
        type="submit"
        className="w-fit px-[24px] bg-main text-white font-semibold py-[10px] rounded-[4px] hover:bg-cyan-400 transition"
      >
        Save Profile
      </Button>
    </div>
  );
};

const Checkbox = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex gap-[8px] items-center w-full">
      <div className="w-[24px] h-[24px] flex justify-center items-center">
        <input className="w-[18px] h-[18px]" type="checkbox" />
      </div>

      {children}
    </div>
  );
};

export default Security;
