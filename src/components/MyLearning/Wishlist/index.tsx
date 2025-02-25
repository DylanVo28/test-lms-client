import { useGetCategories } from '@/components/CreateCourse/service';
import NoData from '@/components/ListCourse/NoData';
import IconFilter from '@/components/UI/Icons/IconFilter';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { useGetPrices } from '@/services/filter.service';
import { useEffect, useState } from 'react';
import { useGetListWishList } from '../service';
import CardCourse from '@/components/CourseSearch/ListCourse/CardCourse';
import Loading from '@/components/UI/Loading';
import { useTranslation } from 'next-i18next';
import { useProfile } from '@/store/profile/useProfile';

const Wishlist = () => {
  const { t } = useTranslation('common');
  const SORT_BY = [
    { key: 'createdAt desc', label: t('Newest') },
    { key: 'createdAt asc', label: t('Oldest') },
  ];
  const { dataCategories: categories } = useGetCategories();
  const { data: prices } = useGetPrices();
  const [category, setCategory] = useState();
  const [sort, setSort] = useState();
  const { profile } = useProfile();
  const [price, setPrice] = useState();

  const { list, reload, loading, loadingMore } = useGetListWishList({
    pageSize: 50,
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
    reload();
  }, [sort, category, price, profile]);

  return (
    <div className="flex flex-col gap-[26px]">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="py-2 min-w-[98px] px-[10px] cursor-pointer flex items-center gap-1 bg-main-10 border-1 border-main rounded">
              <IconFilter />
              <Text className="text-main" type="font-14-500">
                {t('All Filter')}
              </Text>
            </div>
            <SelectCustom
              placeholder={t('Categories')}
              className="min-w-[120px]"
              options={mapCategories()}
              value={category}
              onChange={(value: any) => {
                setCategory(value.target.value);
              }}
            />
            <SelectCustom
              placeholder={t('Price')}
              className="min-w-[80px]"
              options={mapPrices()}
              value={price}
              onChange={(value: any) => {
                setPrice(value.target.value);
              }}
            />
          </div>
          <div className="md:flex hidden items-center gap-2">
            <Text type="font-14-500" className="text-black-7 w-[100px]">
              {t('Sort by')}
            </Text>
            <SelectCustom
              placeholder={t('Default')}
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
            className="text-black-7 w-[60px] md:w-[100px]"
          >
            {t('Sort by')}
          </Text>
          <SelectCustom
            placeholder={t('Default')}
            className="md:min-w-[40px] min-w-[100px] max-w-[40px] md:max-w-[40px]"
            options={SORT_BY}
            value={sort}
            onChange={(value: any) => {
              setSort(value.target.value);
            }}
          />
        </div>
      </div>
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {list?.length > 0 &&
              list.map((item, key) => (
                <CardCourse isWishList item={item?.course} key={key} />
              ))}
          </div>
          {list?.length === 0 && <NoData />}
        </>
      )}
      {loading && <Loading />}
    </div>
  );
};
export default Wishlist;
