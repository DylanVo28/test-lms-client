/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import classNames from 'classnames';
import { ExternalToast, toast as t } from 'sonner';
// import { Icon } from '~components/UI/IconFont/Icon';

import styles from './index.module.scss';
import Text from '../Text';

export const toast = {
  success: (message: string, data?: ExternalToast) => {
    // t.success(message, data);
    t.custom(
      (id) => (
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap p-3 text-gray-500 bg-[#162312] rounded-lg shadow min-w-[380px] border-1 border-[#274916]">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <CheckCircle size={24} color="#3E8800" weight="fill" />
          </div>
          <Text
            type="font-14-400"
            className="text-white max-w-[85%] md:max-w-max"
          >
            {message}
          </Text>
        </div>
      ),
      data
    );
  },

  error: (message: string, data?: ExternalToast) => {
    t.custom(
      (id) => (
        <div className="flex items-center gap-3 md:w-max flex-wrap md:flex-nowrap mx-auto min-w-xs p-3 text-gray-500 bg-[#2c1618] rounded-lg shadow min-w-[380px] border-1 border-[#5b2526]">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <XCircle size={24} color="#d31717" weight="fill" />
          </div>
          <Text
            type="font-14-400"
            className="text-white max-w-[85%] md:max-w-max"
          >
            {message}
          </Text>
        </div>
      ),
      data
    );
  },
};
