import CardCourse from '@/components/CourseSearch/ListCourse/CardCourse';
import NoData from '@/components/ListCourse/NoData';
import IconFilter from '@/components/UI/Icons/IconFilter';
import InputText from '@/components/UI/InputText';
import Loading from '@/components/UI/Loading';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import useNavigate from '@/hooks/useNavigate';
import { useGetCategories, useGetPrices } from '@/services/filter.service';
import { useProfile } from '@/store/profile/useProfile';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { ROUTE_PATH } from '@/utils/const';
import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useGetListCourse } from './service';

const ListCourse = () => {
  const SORT_BY = [
    { key: 'createdAt desc', label: 'Newest' },
    { key: 'createdAt asc', label: 'Oldest' },
  ];
  const [pageSize, setPageSize] = useState(4);
  const [sort, setSort] = useState();
  const [category, setCategory] = useState();
  const [price, setPrice] = useState();
  const [valueSearch, setValueSearch] = useState('');
  const router = useRouter();
  const { theme: dataThemeConfig } = useThemeInitial();
  const { navigate } = useNavigate();
  const { profile } = useProfile();

  const { dataCourses, loadMore, noMore, reload, loading, loadingMore } =
    useGetListCourse({
      pageSize,
      order: sort,
      categories: category,
      prices: price,
      authors: dataThemeConfig?.kolId,
      userId: profile?.id,
    });

  const { data: categories } = useGetCategories();
  const { data: prices } = useGetPrices();

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

  const handleChangeSearch = (e: any) => {
    setValueSearch(e.target.value);
  };

  const handleKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      navigate(ROUTE_PATH.COURSE_SEARCH, { keySearch: valueSearch });
      // router.push({
      //   pathname: ROUTE_PATH.COURSE_SEARCH,
      //   query: { keySearch: valueSearch },
      // });
    }
  };
  useEffect(() => {
    if (!profile?.id) return;
    reload();
  }, [sort, category, price, dataThemeConfig?.kolId]);

  return (
    <div className="flex flex-col gap-[26px] px-4 md:pt-0 pt-10 md:px-10">
      <div className="flex justify-between flex-wrap gap-5 items-center">
        <div className="flex items-center gap-3">
          <div className="py-2 px-[10px] cursor-pointer flex items-center gap-1 bg-main-10 border-1 border-main rounded">
            <div>
              <IconFilter />
            </div>
            <Text className="text-main w-max" type="font-14-500">
              {'All Filter'}
            </Text>
          </div>
          <SelectCustom
            placeholder={'Categories'}
            className="min-w-[120px]"
            options={mapCategories()}
            value={category}
            onChange={(value: any) => {
              setCategory(value.target.value);
            }}
          />
          <SelectCustom
            placeholder={'Price'}
            className="min-w-[80px]"
            options={mapPrices()}
            value={price}
            onChange={(value: any) => {
              setPrice(value.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Text
            type="font-14-500"
            className="text-letter/70 w-[70px] md:w-[100px]"
          >
            {'Sort by'}
          </Text>
          <SelectCustom
            placeholder={'Default'}
            className="min-w-[40px] max-w-[200px]"
            options={SORT_BY}
            value={sort}
            onChange={(value: any) => {
              setSort(value.target.value);
            }}
          />
          <InputText
            onChange={handleChangeSearch}
            onKeyUp={handleKeyUp}
            startContent={
              <Image
                width={20}
                height={20}
                alt=""
                src={'/images/img-search.png'}
              />
            }
            className="block md:hidden"
            radius="sm"
            placeholder={'Search'}
          />
        </div>
      </div>
      <div className={clsx('grid grid-cols-1 gap-6', {})}>
        <div className={clsx('flex flex-col items-center gap-9', {})}>
          {!loading && (
            <>
              <div
                className={clsx(
                  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full',
                  {}
                )}
              >
                {dataCourses?.length > 0 &&
                  dataCourses.map((item: any, key: number) => {
                    return <CardCourse item={item} key={key} />;
                  })}
              </div>
              {dataCourses?.length === 0 && (
                <div className="flex justify-center items-center">
                  <NoData text={'No data'} />
                </div>
              )}
            </>
          )}

          {loading && (
            <div className="mt-5">
              <Loading />
            </div>
          )}

          {!noMore && !loading && (
            <Button
              variant="light"
              radius="full"
              className="hover:!bg-main-20"
              onPress={loadMore}
            >
              <div className="flex items-center gap-[2px]">
                <Text type="font-14-500" className="text-main">
                  {'See More'}
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
      </div>
    </div>
  );
};
export default ListCourse;
