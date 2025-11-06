import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import Info from '@/components/UI/Icons/Info';
import Image from 'next/image';
import { useGetMyCertificates, useMintCertificate } from '../service';
import NoData from '@/components/ListCourse/NoData';
import Loading from '@/components/UI/Loading';
import { useProfile } from '@/store/profile/useProfile';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from '@/components/UI/Toast/toast';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useHasMinted } from '@/hooks/useHasMinted';
import CertificationItem from './CertificationItem';

const Certifications = () => {
  const { t } = useTranslation('common');
  const { profile } = useProfile();
  const { dataListCertificates, loading, run } = useGetMyCertificates();
  // Normalize data shape (query.data or { data: [...] }) to a plain array
  const certificates: any[] =
    ((dataListCertificates as any)?.data as any[]) ||
    ((Array.isArray(dataListCertificates) ? (dataListCertificates as any) : []) as any[]);
  const account = useAccount();
  const { address: walletAddress } = account;

  useEffect(() => {
    run();

    // if all dataListCertificates
    if (certificates?.every((item: any) => item.tokenId)) {
      return;
    }

    //call api every 5s
    const interval = setInterval(() => {
      run();
    }, 5000);
    return () => clearInterval(interval);
  }, [profile]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Text type="font-18-600" className="text-letter">
          {t('myLearning.certifications.preparation')}
        </Text>
        <div className="flex flex-col gap-5 md:gap-0 md:flex-row justify-between md:items-center">
          <div className="flex items-center gap-[2px]">
            <Text type="font-16-400" className="text-letter">
              {t('myLearning.certifications.preparingFor')}{' '}
              <Text element="span" type="font-16-700" className="text-letter">
                {`${certificates?.length || 0} ${t(
                  'myLearning.certifications.title'
                )}`}
              </Text>
            </Text>
            {/* <Info className="text-letter" size={18} /> */}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates?.map((item: any) => {
          return (
            <CertificationItem
              key={item?.id}
              item={item}
              refetchCertificates={run}
            />
          );
        })}
      </div>
      {certificates?.length === 0 && <NoData />}

      {loading && (certificates?.length === 0 || !dataListCertificates) && (
          <Loading />
        )}
    </div>
  );
};
export default Certifications;
