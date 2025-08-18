import { Fragment } from 'react';
import Text from '../UI/Text';

const WhatExchangeVolumnHistoryItem = ({ item, hasDivided = false }: any) => {
  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <Text type="font-14-500">{item.date}</Text>

        <div className="flex justify-between">
          <div className="flex flex-col">
            <Text type="font-12-400" className="opacity-70">
              Volume
            </Text>
            <Text type="font-14-500">{item.perp_volume.toFixed(3)}</Text>
          </div>
          <div className="flex flex-col">
            <Text type="font-12-400" className="opacity-70">
              Fee
            </Text>
            <Text type="font-14-500">{item.total_fee.toFixed(6)}</Text>
          </div>
          <div className="flex flex-col">
            <Text type="font-12-400" className="opacity-70">
              PNL
            </Text>
            <Text type="font-14-500">{item.realized_pnl.toFixed(3)}</Text>
          </div>
          <div className="flex flex-col">
            <Text className="font-12-400 text-[#02A6C2] opacity-70">Point</Text>
            <Text className="font-14-500">{item?.points?.toFixed(2)}</Text>
          </div>
        </div>
      </div>
      {hasDivided && <div className="w-full h-[1px] opacity-10 bg-[#fff]" />}
    </Fragment>
  );
};

export default WhatExchangeVolumnHistoryItem;
