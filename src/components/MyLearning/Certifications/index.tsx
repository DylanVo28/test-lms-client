import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { Info } from '@phosphor-icons/react';
import Image from 'next/image';

const DATA_CERTIFICATION = [
  {
    id: 1,
    title: 'AWS Certified Solutions Architect - Associate',
    des: 'Amazon Web Services Training and Certification',
    urlImage: '/images/img-certification-1.png',
  },
  {
    id: 2,
    title: 'Project Management Professional (PMP)®',
    des: 'Project manager',
    urlImage: '/images/img-certification-2.png',
  },
  {
    id: 3,
    title: 'CCNA',
    des: 'Cisco',
    urlImage: '/images/img-certification-3.png',
  },
];

const Certifications = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Text type="font-18-600" className="text-white">
          Certification Preparation
        </Text>
        <div className="flex flex-col gap-5 md:gap-0 md:flex-row justify-between md:items-center">
          <div className="flex items-center gap-[2px]">
            <Text type="font-16-400" className="text-white">
              You are preparing for{' '}
              <Text element="span" type="font-16-700" className="text-white">
                3 certifications
              </Text>
            </Text>
            <Info className="text-white" size={18} />
          </div>

          <Button className="bg-transparent w-max border-1 border-main rounded py-[10px] px-6 min-h-[44px]">
            <Text type="font-16-600" className="text-main">
              Explore certification preparation
            </Text>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DATA_CERTIFICATION?.map((item) => {
          return (
            <div
              key={item?.id}
              className="rounded border-1 border-white/10 bg-white/10 p-4 flex items-center gap-3"
            >
              <Image
                src={item?.urlImage}
                alt=""
                width={120}
                height={120}
                className="w-[120px] h-[120px]"
              />

              <div className="flex flex-col gap-3">
                <Text type="font-18-600" className="text-white">
                  {item?.title}
                </Text>
                <Text type="font-16-400" className="text-black-7">
                  {item?.des}
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Certifications;
