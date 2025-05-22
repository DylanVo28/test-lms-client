import React, { useEffect, useState } from 'react';
import { privateRequest, request } from '@/api/request';
import { API_PATH } from '@/api/constant';
import Pagination from './Pagination';

interface Reward {
  txHash: string;
  amount: string;
  createdAt: string;
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const formattedDate = date.toLocaleDateString([], {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  return `${time} ${formattedDate}`;
};

const RewardHistory = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await privateRequest(
          request.get,
          API_PATH.REWARD_HISTORY
        );
        setRewards(response.data);
      } catch (error) {
        console.error('Error fetching reward history:', error);
      }
    };

    fetchRewards();
  }, []);

  const totalPages = Math.ceil(rewards.length / rowsPerPage);
  const paginatedData = rewards.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-1">
      {paginatedData.map((reward, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-white">Claim Reward</p>
              <p className="text-xs text-gray-400">
                Tx:{' '}
                <a
                  href={`https://testnet.ftmscan.com/tx/${reward.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline hover:text-blue-400 text-xs"
                >
                  {reward.txHash.slice(0, 4)}...{reward.txHash.slice(-4)}
                </a>
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">
                ${parseFloat(reward.amount)}
              </p>
              <p className="text-xs text-gray-400">
                {formatDateTime(reward.createdAt)}
              </p>
            </div>
          </div>
          {index < paginatedData.length - 1 && (
            <div className="border-t border-[#2d2a2a]" />
          )}
        </React.Fragment>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default RewardHistory;
