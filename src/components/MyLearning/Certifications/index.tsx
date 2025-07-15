import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { Info } from '@phosphor-icons/react';
import Image from 'next/image';
import { useGetMyCertificates, useMintCertificate } from '../service';
import NoData from '@/components/ListCourse/NoData';
import Loading from '@/components/UI/Loading';
import { useProfile } from '@/store/profile/useProfile';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from '@/components/UI/Toast/toast';
import Link from 'next/link';
import { useHasMinted } from '@/hooks/useHasMinted';
import CertificationItem from './CertificationItem';

const Certifications = () => {
  const { profile } = useProfile();
  const { dataListCertificates, loading, run } = useGetMyCertificates();
  const account = useAccount();
  const { address: walletAddress } = account;

  useEffect(() => {
    run();
  }, [profile]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Text type="font-18-600" className="text-white">
          {'Certification Preparation'}
        </Text>
        <div className="flex flex-col gap-5 md:gap-0 md:flex-row justify-between md:items-center">
          <div className="flex items-center gap-[2px]">
            <Text type="font-16-400" className="text-white">
              {'You are preparing for'}{' '}
              <Text element="span" type="font-16-700" className="text-white">
                {`${dataListCertificates?.data?.length || 0} ${'certifications'}`}
              </Text>
            </Text>
            <Info className="text-white" size={18} />
          </div>

          {/* <Button className="bg-transparent w-max border-1 border-main rounded py-[10px] px-6 min-h-[44px]">
            <Text type="font-16-600" className="text-main">
              {'Explore certification preparation'}
            </Text>
          </Button> */}
        </div>
      </div>
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataListCertificates?.data?.map((item: any) => {
              return <CertificationItem key={item?.id} item={item} />;
            })}
          </div>
          {dataListCertificates?.data?.length === 0 && <NoData />}
        </>
      )}
      {loading && <Loading />}
    </div>
  );
};
export default Certifications;
