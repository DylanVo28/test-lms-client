import { useGetCategories } from '@/components/CreateCourse/service';
import NoData from '@/components/ListCourse/NoData';
import IconFilter from '@/components/UI/Icons/IconFilter';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { useGetPrices } from '@/services/filter.service';
import { useEffect, useState } from 'react';
// import { useGetListFollowMentors } from '../service';
import CardCourse from '@/components/CourseSearch/ListCourse/CardCourse';
import Loading from '@/components/UI/Loading';
import InputText from '@/components/UI/InputText';
import { useRouter } from 'next/router';
import Image from 'next/image';
import CardMentor from '../CardMentor';
import { useDebounce } from 'ahooks';
import { useGetListFollowers } from '../service';
import { useTranslation } from 'next-i18next';
import { useProfile } from '@/store/profile/useProfile';
const RATINGS = [
  { key: '5', label: '5 Star' },
  { key: '4', label: '4 Star' },
  { key: '3', label: '3 Star' },
  { key: '2', label: '2 Star' },
  { key: '1', label: '1 Star' },
];
const FollowMentors = () => {
  const [rating, setRating] = useState();
  const [valueSearch, setValueSearch] = useState('');
  const { t } = useTranslation('common');
  const { profile } = useProfile();
  const [debounceVal, setDebounceVal] = useState('');
  const debounceValue = useDebounce(valueSearch, { wait: 500 });

  const { list, reload, loading } = useGetListFollowers({
    pageSize: 50,
    search: valueSearch,
    rating: rating,
  });

  useEffect(() => {
    reload();
  }, [debounceVal, rating, profile]);

  useEffect(() => {
    console.log('Debounced:', valueSearch);
    setDebounceVal(valueSearch);
  }, [debounceValue]);

  const handleChangeSearch = (e: any) => {
    setValueSearch(e.target.value);
  };

  console.log(list, 'list');

  return (
    <div className="flex flex-col gap-[26px]">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <InputText
              onChange={handleChangeSearch}
              startContent={
                <Image
                  width={20}
                  height={20}
                  alt=""
                  src={'/images/img-search.png'}
                />
              }
              className="md:min-w-[470px] md:max-w-[470px]"
              radius="sm"
              placeholder="Search"
            />
          </div>
          <div className="md:flex hidden items-center gap-2">
            <Text type="font-14-500" className="text-black-7 w-[100px]">
              {t('Sort by')}
            </Text>
            <SelectCustom
              placeholder="Ratings"
              className="min-w-[40px]"
              options={RATINGS}
              value={rating}
              onChange={(value: any) => {
                setRating(value.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex md:hidden items-center gap-2">
          <Text
            type="font-14-500"
            className="text-black-7 w-[60px] md:w-[100px]"
          >
            {t('Sort by')}
          </Text>
          <SelectCustom
            placeholder="Default"
            className="md:min-w-[40px] min-w-[100px] max-w-[40px] md:max-w-[40px]"
            options={RATINGS}
            value={rating}
            onChange={(value: any) => {
              setRating(value.target.value);
            }}
          />
        </div>
      </div>
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {list?.map((item) => {
              return <CardMentor mentor={item?.followedUser} key={item?.id} />;
            })}
          </div>
        </>
      )}
      {loading && <Loading />}
      {list?.length === 0 && <NoData />}
      {/* {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {list?.length > 0 &&
              list.map((item, key) => (
                <CardCourse isFollowMentors item={item?.course} key={key} />
              ))}
          </div>
          {list?.length === 0 && <NoData />}
        </>
      )}
      {loading && <Loading />} */}
    </div>
  );
};
export default FollowMentors;
