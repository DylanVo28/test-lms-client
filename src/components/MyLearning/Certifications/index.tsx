import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { Info } from '@phosphor-icons/react';
import Image from 'next/image';
import { useGetMyCertificates } from '../service';
import NoData from '@/components/ListCourse/NoData';
import Loading from '@/components/UI/Loading';
import { useTranslation } from 'next-i18next';

const Certifications = () => {
  const { t } = useTranslation('common');
  const { dataListCertificates, loading } = useGetMyCertificates();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Text type="font-18-600" className="text-white">
          {t('Certification Preparation')}
        </Text>
        <div className="flex flex-col gap-5 md:gap-0 md:flex-row justify-between md:items-center">
          <div className="flex items-center gap-[2px]">
            <Text type="font-16-400" className="text-white">
              {t('You are preparing for')}{' '}
              <Text element="span" type="font-16-700" className="text-white">
                {`${dataListCertificates?.data?.length} ${t('certifications')}`}
              </Text>
            </Text>
            <Info className="text-white" size={18} />
          </div>

          {/* <Button className="bg-transparent w-max border-1 border-main rounded py-[10px] px-6 min-h-[44px]">
            <Text type="font-16-600" className="text-main">
              {t('Explore certification preparation')}
            </Text>
          </Button> */}
        </div>
      </div>
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataListCertificates?.data?.map((item: any) => {
              return (
                <div
                  key={item?.id}
                  className="rounded border-1 border-white/10 bg-white/10 p-4 flex items-center gap-3"
                >
                  <Image
                    src={item?.certificate?.image}
                    alt=""
                    width={120}
                    height={120}
                    className="w-[120px] h-[120px]"
                    onError={(e: any) => {
                      e.target.srcset = '/images/img-certification.png';
                    }}
                  />

                  <div className="flex flex-col gap-3">
                    <Text type="font-18-600" className="text-white">
                      {item?.certificate?.name}
                    </Text>
                    <Text type="font-16-400" className="text-black-7">
                      {item?.certificate?.description}
                    </Text>
                  </div>
                </div>
              );
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
