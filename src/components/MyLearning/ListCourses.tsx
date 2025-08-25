import React, { useEffect, useState } from 'react';
import IconFilter from '../UI/Icons/IconFilter';
import Text from '@/components/UI/Text';
import SelectCustom from '../UI/SelectCustom';
import { useGetCategories } from '../CreateCourse/service';
import { useGetPrices } from '@/services/filter.service';
import CourseCard from './CourseCard';
import { useGetListUserCourse } from './service';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import NoData from '../ListCourse/NoData';
import { useProfile } from '@/store/profile/useProfile';
import Loading from '../UI/Loading';
import { useTranslation } from 'next-i18next';
export default function ListCourses() {
  const { t } = useTranslation('common');
  const SORT_BY = [
    { key: 'createdAt desc', label: t('listCourse.newest') },
    { key: 'createdAt asc', label: t('listCourse.oldest') },
  ];
  const [pageSize, setPageSize] = useState(4);
  const [sort, setSort] = useState();
  const [category, setCategory] = useState();
  const [price, setPrice] = useState();
  const { dataCategories: categories } = useGetCategories();
  const { data: prices } = useGetPrices();
  const { profile } = useProfile();

  const { list, loadMore, noMore, reload, loading } = useGetListUserCourse({
    pageSize,
    order: sort,
    categories: category,
    prices: price,
  });

  const mapCategories = () => {
    return (categories?.data || [])?.map((item: any) => {
      return {
        key: item.id,
        label: item.name,
      };
    });
  };

  const mapPrices = () => {
    return (prices?.data || [])?.map((item: any) => {
      return {
        key: item.key,
        label: item.label,
      };
    });
  };

  useEffect(() => {
    if (!profile.id) return;

    const timer = setTimeout(() => {
      reload();
    }, 300);

    return () => clearTimeout(timer);
  }, [sort, category, price, profile]);

  return (
    <div className="flex flex-col gap-[26px]">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="py-2 px-[10px] cursor-pointer flex items-center gap-1 bg-main-10 border-1 border-main rounded">
              <div>
                <IconFilter />
              </div>
              <Text className="text-main w-max" type="font-14-500">
                {t('listCourse.allFilter')}
              </Text>
            </div>
            <SelectCustom
              placeholder={t('listCourse.categories')}
              className="min-w-[120px]"
              options={mapCategories()}
              value={category}
              onChange={(value: any) => {
                setCategory(value.target.value);
              }}
            />
            <SelectCustom
              placeholder={t('listCourse.price')}
              className="min-w-[80px]"
              options={mapPrices()}
              value={price}
              onChange={(value: any) => {
                setPrice(value.target.value);
              }}
            />
          </div>
          <div className="md:flex hidden items-center gap-2">
            <Text type="font-14-500" className="text-letter/70 w-[100px]">
              {t('listCourse.sortBy')}
            </Text>
            <SelectCustom
              placeholder={t('listCourse.default')}
              className="min-w-[40px]"
              options={SORT_BY}
              value={sort}
              onChange={(value: any) => {
                setSort(value.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex md:hidden items-center gap-2">
          <Text
            type="font-14-500"
            className="text-letter/70 w-[60px] md:w-[100px]"
          >
            {t('listCourse.sortBy')}
          </Text>
          <SelectCustom
            placeholder={t('listCourse.default')}
            className="md:min-w-[40px] min-w-[100px] max-w-[40px] md:max-w-[40px]"
            options={SORT_BY}
            value={sort}
            onChange={(value: any) => {
              setSort(value.target.value);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {list?.length > 0 &&
          list.map((item) => (
            <CourseCard
              key={item.id}
              id={item?.course?.id}
              name={item?.course?.title}
              countReviews={item?.countReviews}
              course={item?.course}
              author={item?.course?.author}
              image={item?.course?.image}
              progress={Math.min(item?.progress || 0, 1)}
            />
          ))}
      </div>

      {!loading && <>{list?.length === 0 && <NoData />}</>}

      {loading && !list?.length && <Loading />}

      {!noMore && list?.length > 0 && !loading && (
        <Button
          variant="light"
          radius="full"
          className="hover:!bg-main-20 w-max mx-auto"
          onPress={loadMore}
        >
          <div className="flex items-center gap-[2px]">
            <Text type="font-14-500" className="text-main">
              {t('listCourse.seeMore')}
            </Text>
            <Image
              src={'/icons/ic-arrow-drop-right-line.svg'}
              width={20}
              height={20}
              alt=""
            />
          </div>
        </Button>
      )}
    </div>
  );
}
