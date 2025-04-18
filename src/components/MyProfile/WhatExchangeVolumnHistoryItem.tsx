import { Fragment } from 'react';
import Text from '../UI/Text';
import { useTranslation } from 'next-i18next';

const WhatExchangeVolumnHistoryItem = ({ item, hasDivided = false }: any) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <Text type="font-14-500">{item.date}</Text>

        <div className="flex justify-between">
          <div className="flex flex-col">
            <Text type="font-12-400" className="opacity-70">
              {t('Volume')}
            </Text>
            <Text type="font-14-500">{item.perp_volume.toFixed(3)}</Text>
          </div>
          <div className="flex flex-col">
            <Text type="font-12-400" className="opacity-70">
              {t('Fee')}
            </Text>
            <Text type="font-14-500">{item.total_fee.toFixed(6)}</Text>
          </div>
          <div className="flex flex-col">
            <Text type="font-12-400" className="opacity-70">
              {t('PNL')}
            </Text>
            <Text type="font-14-500">{item.realized_pnl.toFixed(3)}</Text>
          </div>
        </div>
      </div>
      {hasDivided && <div className="w-full h-[1px] opacity-10 bg-[#fff]" />}
    </Fragment>
  );
};

export default WhatExchangeVolumnHistoryItem;
