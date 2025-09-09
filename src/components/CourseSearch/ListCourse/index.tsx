import { useGetListCourse } from '@/components/Course/ListCourse/service';
import IconDeleteMain from '@/components/UI/Icons/IconDeleteMain';
import IconShowFilter from '@/components/UI/Icons/IconShowFilter';
import LoadingScreen from '@/components/UI/LoadingScreen';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import DrawerFilter from '../DrawerFilter';
import { useLikeCourse, useUnLikeCourse } from '../service';
import CardCourse from './CardCourse';
import FilterCourse from './FilterCourse';

enum TAB_VIEW {
  GRID = 'grid',
  LIST = 'list',
}
const initParams = {
  ratings: '',
  langs: [],
  features: [],
  topics: [],
  levels: [],
  prices: [],
};
const ListCourse = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [sort, setSort] = useState<any>();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();

  const SORT_BY = [
    { key: 'createdAt desc', label: t('listCourse.newest') },
    { key: 'createdAt asc', label: t('listCourse.oldest') },
  ];

  const refDrawerFilter: any = useRef(null);

  const [params, setParams] = useState(initParams);
  const { theme: dataThemeConfig } = useThemeInitial();

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
    pageSize: 12,
    order: sort,
    prices: params?.prices?.join(','),
    ratings: params?.ratings,
    langs: params?.langs?.join(','),
    features: params?.features?.join(','),
    topics: params?.topics?.join(','),
    levels: params?.levels?.join(','),
    search,
    authors: dataThemeConfig?.kolId,
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
    setSearchQuery('');
    // Clear search from URL
    const currentQuery = { ...router.query };
    delete currentQuery.keySearch;
    router.push({
      pathname: router.pathname,
      query: currentQuery,
    });
  };

  return (
    <LoadingScreen isLoading={loading || loadingMore}>
      <div className="flex flex-col gap-8 mb-4 md:mb-0 pt-[36px] md:px-10">
        <Text type="font-28-700" className="text-letter px-4 md:px-0">
          {searchQuery || router?.query?.keySearch
            ? `${dataCourses?.length} ${t('listCourse.searchFor')} "${
                searchQuery || router?.query?.keySearch
              }"`
            : `${dataCourses?.length} ${t('listCourse.results')}`}
        </Text>
        <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-0">
          {/* Filters Section - Left Sidebar */}
          <div className="lg:w-1/4 xl:w-1/5">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <Button
                  className="min-w-[107px] border-1 py-[10px] px-2 bg-card border-[#F0F0F01A] rounded flex lg:hidden"
                  onPress={() => setShowMobileFilters(true)}
                >
                  <div className="flex items-center gap-1">
                    <IconShowFilter />
                    <Text type="font-14-500" className="text-letter/70">
                      {t('listCourse.filters')}
                    </Text>
                  </div>
                </Button>
                <SelectCustom
                  placeholder={t('listCourse.sortByType')}
                  className="w-full"
                  options={SORT_BY}
                  value={sort}
                  onChange={(value: any) => {
                    setSort(value.target.value);
                  }}
                />
              </div>
              <FilterCourse
                setParams={setParams}
                params={params}
                showMobileFilters={showMobileFilters}
                setShowMobileFilters={setShowMobileFilters}
                onSearchQueryChange={setSearchQuery}
              />
            </div>
          </div>

          {/* Course List Section - Right Content */}
          <div className="lg:w-3/4 xl:w-4/5">
            <div className="flex flex-col gap-9">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Desktop Clear Filter Button */}
                  <div className="flex">
                    <Button
                      radius="full"
                      className="w-max hover:bg-main-20"
                      variant="light"
                      onPress={clearFilter}
                    >
                      <div className="flex items-center gap-2">
                        <IconDeleteMain />
                        <Text type="font-16-700" className="text-main">
                          {t('listCourse.clearFilter')}
                        </Text>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
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

              {/* Load More Button */}
              {!noMore && (
                <Button
                  variant="light"
                  radius="full"
                  className="hover:bg-main-20 w-max mx-auto"
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
          </div>
        </div>
        {/* Mobile Filter Drawer */}
        <DrawerFilter
          setParams={setParams}
          params={params}
          ref={refDrawerFilter}
        />
      </div>
    </LoadingScreen>
  );
};
export default ListCourse;
