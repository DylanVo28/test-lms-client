import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/UI/Card/Card';
import RewardHistory from './RewardHistory';
import SoldCourses from './SoldCourses';
import { useUSDCOperations, VAULT_ADDRESS } from '@/hooks/useExecute';
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { toast } from '@/components/UI/Toast/toast';
import { Info } from '@phosphor-icons/react';
import { Tooltip, Spinner } from '@nextui-org/react';
import { useProfile } from '@/store/profile/useProfile';
import { getVaultContract } from '@/hooks/useContract';
import BigNumber from 'bignumber.js';
import { BIG_TEN } from '@/utils/bigNumber';
import { extractRevertReason } from '@/utils/common';

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    className={`flex-1 px-6 py-1 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap
      ${
        active
          ? 'bg-[#23262F] text-letter shadow-sm'
          : 'text-[#777E90] hover:text-letter hover:bg-[#23262F]/70'
      }
    `}
    style={{ minWidth: 0 }}
    onClick={onClick}
  >
    {children}
  </button>
);

const Earnings = ({ reload }: { reload: () => void }) => {
  const [activeTab, setActiveTab] = useState('sold_courses');
  const [claimLoading, setClaimLoading] = useState(false);
  const { profile } = useProfile();
  const [totalRewards, setTotalRewards] = useState(0);
  const { withdraw } = useUSDCOperations();
  const vaultContract = getVaultContract(VAULT_ADDRESS);

  const getKOLClaimableAmount = async () => {
    if (!vaultContract) return;
    const tx = await vaultContract.getKolClaimableAmount(
      profile?.walletAddress
    );
    const formatByDecimal = BigNumber(tx.toString())
      .dividedBy(BIG_TEN.pow(18))
      .toNumber();
    setTotalRewards(formatByDecimal);
  };

  useEffect(() => {
    getKOLClaimableAmount();

    const interval = setInterval(() => {
      getKOLClaimableAmount();
    }, 5000);

    return () => clearInterval(interval);
  }, [profile?.walletAddress]);

  const handleWithdraw = async () => {
    setClaimLoading(true);
    let metadata = null;
    try {
      metadata = await privateRequest(
        request.get,
        API_PATH.GET_WITHDRAW_METADATA
      );
      const tx = await withdraw(
        metadata.data.transactionId,
        metadata.data.nonce,
        metadata.data.deadline,
        metadata.data.signature
      );

      if (tx) {
        toast.success('Successfully withdraw from the course.');
      }
    } catch (error: any) {
      const isCancelTransaction = error.message.includes(
        'user rejected transaction'
      );
      if (isCancelTransaction) {
        const cancelTxRes = await privateRequest(
          request.post,
          API_PATH.CANCEL_TRANSACTION(metadata.data.transactionId)
        );

        toast.error('Cancel transaction.');
        return;
      }

      toast.error(extractRevertReason(error.message));
    } finally {
      setClaimLoading(false);
      getKOLClaimableAmount();
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-900">
      <main className="bg-gray-70">
        <div className="">
          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl font-bold bg-clip-text text-letter">
                    Your Rewards
                  </h1>
                  <p className="text-gray-400 mt-1">Available to claim</p>
                  <div className="text-3xl font-bold text-letter mt-1">
                    {totalRewards.toLocaleString()}{' '}
                    <span className="text-main">USDC</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={totalRewards <= 0 || claimLoading}
                    className={`px-6 py-2 rounded-lg font-medium text-letter transition-all ${
                      totalRewards > 0 && !claimLoading
                        ? 'bg-[#35B6CC] hover:opacity-90'
                        : 'bg-[#3a4757] cursor-not-allowed opacity-50'
                    }`}
                    onClick={handleWithdraw}
                  >
                    {claimLoading ? (
                      <Spinner size="sm" color="default" />
                    ) : (
                      'Claim'
                    )}
                  </button>
                  <Tooltip content="Transaction will need gas fee.">
                    <span className="cursor-pointer">
                      <Info size={16} className="text-main" color="#818181" />
                    </span>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto">
          <div className="flex w-fit rounded-xl bg-[#18191D] p-1.5 gap-1">
            <TabButton
              active={activeTab === 'sold_courses'}
              onClick={() => setActiveTab('sold_courses')}
            >
              Sold Courses
            </TabButton>
            <TabButton
              active={activeTab === 'rewards'}
              onClick={() => setActiveTab('rewards')}
            >
              Reward History
            </TabButton>
          </div>
        </div>

        <div className="">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'sold_courses'
                  ? 'Sold Courses'
                  : 'Reward History'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'sold_courses' && <SoldCourses />}
              {activeTab === 'rewards' && <RewardHistory />}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Earnings;
