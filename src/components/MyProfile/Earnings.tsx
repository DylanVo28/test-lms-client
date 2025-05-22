import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/UI/Card/Card';
import RewardHistory from './RewardHistory';
import YourNetwork from './YourNetwork';
import { TUser } from './service';
import { useUSDCOperations } from '@/hooks/useExecute';
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { toast } from '@/components/UI/Toast/toast';
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    className={`flex-1 px-6 py-1 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500
      ${
        active
          ? 'bg-[#23262F] text-white shadow-sm'
          : 'text-[#777E90] hover:text-white hover:bg-[#23262F]/70'
      }
    `}
    style={{ minWidth: 0 }}
    onClick={onClick}
  >
    {children}
  </button>
);

const Earnings = ({ user }: { user?: TUser }) => {
  const [activeTab, setActiveTab] = useState('network');
  const totalRewards = user?.withdrawable || 0;
  const { withdraw, isTxIdUsed } = useUSDCOperations();

  const handlecheck = async (txId: string) => {
    try {
      const result = await isTxIdUsed(txId);
      if (result === true) {
        await privateRequest(request.get, API_PATH.UPDATE_KOL_REWARD);
      }
      toast.success(`${result}`);
    } catch (error) {
      toast.error(`'Failed to enroll in the course. Please try again.'`);
    }
  };

  const handleWithdraw = async () => {
    try {
      const metadata = await privateRequest(
        request.get,
        API_PATH.GET_WITHDRAW_METADATA
      );
      const tx = await withdraw(
        metadata.data.transactionId,
        metadata.data.amountWithDecimals,
        metadata.data.deadline,
        metadata.data.signature
      );
      if (tx.hash) {
        await handlecheck(metadata.data.transactionId);
        toast.success('Successfully withdraw from the course.');
      }
    } catch (error) {
      toast.error('Failed to withdraw from the course. Please try again.');
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-900">
      <main className="bg-gray-70">
        <div className="">
          <Card>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl font-bold bg-clip-text text-white">
                    Your Rewards
                  </h1>
                  <p className="text-gray-400 mt-1">Available to claim</p>
                  <div className="text-3xl font-bold text-white mt-1">
                    {totalRewards.toLocaleString()}{' '}
                    <span className="text-amber-500">USDC</span>
                  </div>
                </div>
                <button
                  disabled={totalRewards <= 0}
                  className={`px-6 py-2 rounded-lg font-medium text-white transition-all ${
                    totalRewards > 0
                      ? 'bg-[#35B6CC] hover:opacity-90'
                      : 'bg-[#3a4757] cursor-not-allowed opacity-50'
                  }`}
                  onClick={handleWithdraw}
                >
                  Claim
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex w-fit rounded-xl bg-[#18191D] p-1.5 gap-1">
            <TabButton
              active={activeTab === 'network'}
              onClick={() => setActiveTab('network')}
            >
              Your Network
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
                {activeTab === 'network' ? 'Your Network' : 'Reward History'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'network' ? (
                <YourNetwork />
              ) : (
                <div className="space-y-4">
                  <RewardHistory />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Earnings;
