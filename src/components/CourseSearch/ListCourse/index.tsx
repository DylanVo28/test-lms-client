import Text from '@/components/UI/Text';
import CardCourse from './CardCourse';
import { Button, Tab, Tabs } from '@nextui-org/react';
import Image from 'next/image';
import clsx from 'clsx';
import FilterCourse from './FilterCourse';
import { useRouter } from 'next/router';
import IconShowFilter from '@/components/UI/Icons/IconShowFilter';
import SelectCustom from '@/components/UI/SelectCustom';
import IconDeleteMain from '@/components/UI/Icons/IconDeleteMain';
import IconGrid from '@/components/UI/Icons/IconGrid';
import IconList from '@/components/UI/Icons/IconList';
import { useEffect, useRef, useState } from 'react';
import { useGetListCourse } from '@/components/Course/ListCourse/service';
import { useGetCategories, useGetPrices } from '@/services/filter.service';
import { useSearchParams } from 'next/navigation';
import { useLikeCourse, useUnLikeCourse } from '../service';
import { getAccessToken } from '@/store/auth';
import { useProfile } from '@/store/profile/useProfile';
import { isMobile } from 'react-device-detect';
import DrawerFilter from '../DrawerFilter';
import LoadingScreen from '@/components/UI/LoadingScreen';

enum TAB_VIEW {
  GRID = 'grid',
  LIST = 'list',
}
const SORT_BY = [
  { key: 'createdAt desc', label: 'Newest' },
  { key: 'createdAt asc', label: 'Oldest' },
  // { key: 'a-z', label: 'A-Z' },
  // { key: 'z-a', label: 'Z-A' },
];
const initParams = {
  ratings: '',
  langs: [],
  features: [],
  topics: [],
  levels: [],
  prices: [],
};
const ListCourse = () => {
  const router = useRouter();
  const [tab, setTab] = useState(TAB_VIEW?.GRID);
  const [pageSize, setPageSize] = useState(3);
  const [sort, setSort] = useState<any>();
  const searchParams = useSearchParams();

  const refDrawerFilter: any = useRef(null);

  const [params, setParams] = useState(initParams);

  const search = searchParams.get('keySearch');
  const {
    dataCourses,
    loadMore,
    noMore,
    reload,
    mutate,
    loading,
    loadingMore,
  } = useGetListCourse({
    pageSize,
    order: sort,
    prices: params?.prices?.join(','),
    ratings: params?.ratings,
    langs: params?.langs?.join(','),
    features: params?.features?.join(','),
    topics: params?.topics?.join(','),
    levels: params?.levels?.join(','),
    search,
  });

  const { run: runLikeCourse } = useLikeCourse({
    onSuccess(res) {
      const index = dataCourses.findIndex(
        (item: any) => item.id === res?.data?.courseId
      );
      dataCourses[index] = {
        ...dataCourses[index],
        liked: true,
      };
    },
  });

  const { run: runUnLikeCourse } = useUnLikeCourse({
    onSuccess(res) {
      const index = dataCourses.findIndex(
        (item: any) => item.id === res?.data?.courseId
      );
      dataCourses[index] = {
        ...dataCourses[index],
        liked: false,
      };
    },
  });

  const handleLike = (id: string) => {
    runLikeCourse(id);
  };
  const handleUnLike = (id: string) => {
    runUnLikeCourse(id);
  };

  useEffect(() => {
    reload();
  }, [sort, search, params]);

  const clearFilter = () => {
    setParams(initParams);
    setSort(null);
  };

  return (
    <LoadingScreen isLoading={loading || loadingMore}>
      <div className="flex flex-col gap-8 mb-4 md:mb-0 pt-[36px] md:px-10">
        <Text
          type="font-32-700"
          className="text-white"
        >{`9,955 results for “${router.query.keySearch}”`}</Text>
        <div className={clsx('grid grid-cols-8 gap-6', {})}>
          <div className="col-span-2  flex-col hidden md:flex gap-5">
            <div className="flex items-center gap-4">
              <Button className="min-w-[107px] border-1 py-[10px] px-2 bg-white/10 border-[#F0F0F01A] rounded">
                <div className="flex items-center gap-1">
                  <IconShowFilter />
                  <Text type="font-14-500" className="text-black-6">
                    Filters
                  </Text>
                </div>
              </Button>
              <SelectCustom
                placeholder="Sort by type"
                className="w-full"
                options={SORT_BY}
                value={sort}
                onChange={(value: any) => {
                  console.log('valueeee', value.target.value);
                  setSort(value.target.value);
                }}
              />
            </div>
            <FilterCourse setParams={setParams} params={params} />
          </div>

          <div
            className={clsx('flex flex-col col-span-8 md:col-span-6 gap-9', {})}
          >
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center">
                {isMobile ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        refDrawerFilter.current.onOpen();
                      }}
                      className="min-w-[117px] max-h-[36px] flex justify-center items-center border-1 py-[10px] px-2 bg-white/10 border-[#F0F0F01A] rounded"
                    >
                      <div className="flex items-center gap-1">
                        <IconShowFilter />
                        <Text type="font-14-500" className="text-black-6">
                          Show Filters
                        </Text>
                      </div>
                    </button>
                    <SelectCustom
                      placeholder="Sort by type"
                      className="w-full"
                      options={SORT_BY}
                      value={sort}
                      onChange={(value: any) => {
                        console.log('valueeee', value.target.value);
                        setSort(value.target.value);
                      }}
                    />
                  </div>
                ) : (
                  <Button
                    radius="full"
                    className="w-max hover:bg-main-20"
                    variant="light"
                    onClick={clearFilter}
                  >
                    <div className="flex items-center gap-2">
                      <IconDeleteMain />
                      <Text type="font-16-700" className="text-main">
                        Clear filter
                      </Text>
                    </div>
                  </Button>
                )}

                <div className="flex items-center gap-4">
                  {dataCourses?.length > 0 && (
                    <Text type="font-20-600" className="text-white">
                      {dataCourses?.length} results
                    </Text>
                  )}
                  {/* <Tabs
                  onSelectionChange={onChangeTab}
                  classNames={{
                    tab: 'w-[30px]',
                    cursor: '!bg-transparent',
                  }}
                  variant={'light'}
                >
                  <Tab
                    key="grid"
                    title={<IconGrid active={tab === TAB_VIEW.GRID} />}
                  />
                  <Tab
                    key="list"
                    title={<IconList active={tab === TAB_VIEW.LIST} />}
                  />
                </Tabs> */}
                </div>
              </div>

              <div
                className={clsx('grid grid-cols-1 md:grid-cols-3 gap-6', {})}
              >
                {dataCourses.map((item: any, key: number) => {
                  return (
                    <CardCourse
                      handleUnLike={handleUnLike}
                      handleLike={handleLike}
                      item={item}
                      key={key}
                    />
                  );
                })}
              </div>
            </div>

            {!noMore && (
              <Button
                variant="light"
                radius="full"
                className="hover:bg-main-20 w-max mx-auto"
                onClick={loadMore}
              >
                <div className="flex items-center gap-[2px]">
                  <Text type="font-14-500" className="text-main">
                    See More
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
      <DrawerFilter
        setParams={setParams}
        params={params}
        ref={refDrawerFilter}
      />
    </LoadingScreen>
  );
};
export default ListCourse;
