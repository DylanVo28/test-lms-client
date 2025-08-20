import AccordionCustom from '@/components/UI/AccordionCustom';
import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import {
  useGetFeatures,
  useGetLanguages,
  useGetLevels,
  useGetPrices,
  useGetRatings,
  useGetTopics,
} from '@/services/filter.service';
import { mapRatingData } from '@/utils/common';
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from '@nextui-org/react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import Rater from 'react-rater';
import { useTranslation } from 'next-i18next';
import IconShowFilter from '@/components/UI/Icons/IconShowFilter';
import IconClose from '@/components/UI/Icons/IconClose';
import IconSearch from '@/components/UI/Icons/IconSearch';
import { useRouter } from 'next/router';

const DATA_LANGUAGE = [
  {
    id: '1',
    label: 'English',
  },
  {
    id: '2',
    label: 'Greece',
  },
  {
    id: '3',
    label: 'Saudi Arabia',
  },
  {
    id: '4',
    label: 'Åland Islands',
  },

  {
    id: '5',
    label: 'Bahrain',
  },
  { id: '6', label: 'Portuguese' },
  { id: '7', label: 'Japanese' },
  { id: '8', label: 'Korean' },
];
const initialItemsLanguage = 5;

const FilterCourse = (props: any) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    params,
    setParams,
    isMobile,
    onCloseModalFilter,
    showMobileFilters,
    setShowMobileFilters,
  } = props;
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef: any = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const [langues, setLangues] = useState([]);
  const [features, setFeatures] = useState([]);
  const [topics, setTopics] = useState([]);
  const [levels, setLevels] = useState([]);
  const [pricesData, setPricesData] = useState([]);

  const { data: ratingsData } = useGetRatings();
  const { data: languagesData } = useGetLanguages({
    onSuccess: (res) => {
      setLangues(res?.data);
    },
  });
  const { data: featuresData } = useGetFeatures({
    onSuccess: (res) => {
      setFeatures(res?.data);
    },
  });
  const { data: topicsData } = useGetTopics({
    onSuccess: (res) => {
      setTopics(res?.data);
    },
  });
  const { data: levelsData } = useGetLevels({
    onSuccess: (res) => {
      setLevels(res?.data);
    },
  });
  const { data: prices } = useGetPrices({
    onSuccess: (res) => {
      setPricesData(res?.data);
    },
  });
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    if (ratingsData?.data) {
      const items = ratingsData.data.map((r: any) => {
        return {
          id: r.value,
          total: r.count,
          ...mapRatingData(r),
        };
      });
      setRatings(items);
    }
  }, [ratingsData]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, DATA_LANGUAGE]);

  // Initialize search query from URL
  useEffect(() => {
    const currentSearch = router.query.keySearch as string;
    if (currentSearch) {
      setSearchQuery(currentSearch);
    }
  }, [router.query.keySearch]);

  // Sync searchQuery with parent component
  useEffect(() => {
    if (props.onSearchQueryChange) {
      props.onSearchQueryChange(searchQuery);
    }
  }, [searchQuery, props.onSearchQueryChange]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Always update URL with search query (even if empty)
    const currentQuery = { ...router.query };
    currentQuery.keySearch = searchQuery.trim();

    router.push({
      pathname: router.pathname,
      query: currentQuery,
    });

    // Close mobile filter sidebar
    setShowMobileFilters && setShowMobileFilters(false);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as any);
    }
  };

  const onSearchLanguages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredLangs = languagesData?.data?.filter((lang: any) =>
      lang.label.toLowerCase().includes(value)
    );
    setLangues(filteredLangs);
  };
  const onSearchFeatures = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredFeatures = featuresData?.data?.filter((feaure: any) =>
      feaure.label.toLowerCase().includes(value)
    );
    setFeatures(filteredFeatures);
  };
  const onSearchTopic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredTopics = topicsData?.data?.filter((topic: any) =>
      topic.label.toLowerCase().includes(value)
    );
    setTopics(filteredTopics);
  };
  const onSearchLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredLevels = levelsData?.data?.filter((level: any) =>
      level.label.toLowerCase().includes(value)
    );
    setLevels(filteredLevels);
  };
  const onSearchPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredPrices = prices?.data?.filter((price: any) =>
      price.label.toLowerCase().includes(value)
    );
    setPricesData(filteredPrices);
  };

  const handleFilterChange = (filterType: string, value: any) => {
    onCloseModalFilter && onCloseModalFilter();
    setShowMobileFilters && setShowMobileFilters(false);

    if (filterType === 'ratings') {
      setParams({
        ...params,
        ratings: value,
      });
    } else if (filterType === 'langs') {
      const idx = params.langs.findIndex((p: any) => p === value);
      if (idx >= 0) {
        const newItems = params.langs.filter((p: any) => p !== value);
        setParams({
          ...params,
          langs: [...newItems],
        });
      } else {
        setParams({
          ...params,
          langs: [...params.langs, value],
        });
      }
    } else if (filterType === 'features') {
      const idx = params.features.findIndex((p: any) => p === value);
      if (idx >= 0) {
        const newItems = params.features.filter((p: any) => p !== value);
        setParams({
          ...params,
          features: [...newItems],
        });
      } else {
        setParams({
          ...params,
          features: [...params.features, value],
        });
      }
    } else if (filterType === 'topics') {
      const idx = params.topics.findIndex((p: any) => p === value);
      if (idx >= 0) {
        const newItems = params.topics.filter((p: any) => p !== value);
        setParams({
          ...params,
          topics: [...newItems],
        });
      } else {
        setParams({
          ...params,
          topics: [...params.topics, value],
        });
      }
    } else if (filterType === 'levels') {
      const idx = params.levels.findIndex((p: any) => p === value);
      if (idx >= 0) {
        const newItems = params.levels.filter((p: any) => p !== value);
        setParams({
          ...params,
          levels: [...newItems],
        });
      } else {
        setParams({
          ...params,
          levels: [...params.levels, value],
        });
      }
    } else if (filterType === 'prices') {
      const idx = params.prices.findIndex((p: any) => p === value);
      if (idx >= 0) {
        const newPrices = params.prices.filter((p: any) => p !== value);
        setParams({
          ...params,
          prices: [...newPrices],
        });
      } else {
        setParams({
          ...params,
          prices: [...params.prices, value],
        });
      }
    }
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-5">
      {/* Rating Filter */}
      <AccordionCustom
        isMobile={isMobile}
        title={
          <Text type="font-18-600" className="text-letter">
            {t('listCourse.rating')}
          </Text>
        }
      >
        <RadioGroup
          classNames={{
            wrapper: 'gap-4',
          }}
          value={params.ratings}
        >
          {ratings.map((item: any) => {
            return (
              <Radio
                classNames={{
                  base: 'gap-1',
                  control: 'bg-white',
                  wrapper:
                    '!border-1 !border-black-7 group-data-[selected=true]:!bg-main group-data-[selected=true]:!border-main',
                }}
                value={item?.id}
                onChange={(e: any) => {
                  handleFilterChange('ratings', e.target.value);
                }}
              >
                <div className="flex items-center gap-2">
                  <Rater total={5} rating={item?.value} />
                  <Text className="text-letter" type="font-14-400">
                    {item?.label}
                  </Text>
                </div>
              </Radio>
            );
          })}
        </RadioGroup>
      </AccordionCustom>

      {/* Language Filter */}
      <AccordionCustom
        isMobile={isMobile}
        title={
          <div className="flex items-center gap-2">
            <Text type="font-18-600" className="text-letter">
              {t('listCourse.language')}
            </Text>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <InputText
            onChange={onSearchLanguages}
            isFilter
            placeholder={t('listCourse.searchPlaceholder')}
          />
          <div className="flex flex-col gap-2">
            <CheckboxGroup size="lg" radius="sm" value={params.langs}>
              {langues?.map((item: any) => {
                return (
                  <Checkbox
                    classNames={{
                      wrapper: 'me-3 after:!bg-main before:!border-black-7',
                      base: '',
                    }}
                    value={item?.value}
                    onChange={(e: any) => {
                      handleFilterChange('langs', e.target.value);
                    }}
                  >
                    <Text type="font-15-500" className="text-letter">
                      {item?.label}
                    </Text>
                  </Checkbox>
                );
              })}
            </CheckboxGroup>

            <div
              ref={contentRef}
              style={{
                height: expanded ? `${contentHeight}px` : '0px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className={clsx('overflow-hidden will-change-transform')}
            >
              <div
                className={clsx(
                  'transition-transform duration-400',
                  expanded
                    ? 'translate-y-0 scale-y-100'
                    : '-translate-y-2 scale-y-95'
                )}
              >
                <CheckboxGroup size="lg" radius="sm">
                  {DATA_LANGUAGE?.slice(initialItemsLanguage)?.map((item) => {
                    return (
                      <Checkbox
                        classNames={{
                          wrapper: 'me-3 after:!bg-main before:!border-black-7',
                          base: '',
                        }}
                        value={item?.id}
                      >
                        <Text type="font-15-500" className="text-letter">
                          {item?.label}
                        </Text>
                      </Checkbox>
                    );
                  })}
                </CheckboxGroup>
              </div>
            </div>
          </div>
        </div>
      </AccordionCustom>

      {/* Features Filter */}
      <AccordionCustom
        isMobile={isMobile}
        title={
          <div className="flex items-center gap-2">
            <Text type="font-18-600" className="text-letter">
              {t('listCourse.handsOnPractice')}
            </Text>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <InputText
            onChange={onSearchFeatures}
            isFilter
            placeholder={t('listCourse.searchPlaceholder')}
          />
          <CheckboxGroup size="lg" radius="sm" value={params.features}>
            {features?.map((item: any) => {
              return (
                <Checkbox
                  classNames={{
                    wrapper: 'me-3 after:!bg-main before:!border-black-7',
                    base: '',
                  }}
                  value={item?.value}
                  onChange={(e: any) => {
                    handleFilterChange('features', e.target.value);
                  }}
                >
                  <Text type="font-15-500" className="text-letter capitalize">
                    {item?.label}
                  </Text>
                </Checkbox>
              );
            })}
          </CheckboxGroup>
        </div>
      </AccordionCustom>

      {/* Topic Filter */}
      <AccordionCustom
        isMobile={isMobile}
        title={
          <Text type="font-18-600" className="text-letter">
            {t('listCourse.topic')}
          </Text>
        }
      >
        <div className="flex flex-col gap-4">
          <InputText
            onChange={onSearchTopic}
            isFilter
            placeholder={t('listCourse.searchPlaceholder')}
          />
          <CheckboxGroup size="lg" radius="sm" value={params.topics}>
            {topics?.map((item: any) => {
              return (
                <Checkbox
                  classNames={{
                    wrapper: 'me-3 after:!bg-main before:!border-black-7',
                    base: '',
                  }}
                  value={item?.value}
                  onChange={(e: any) => {
                    handleFilterChange('topics', e.target.value);
                  }}
                >
                  <Text type="font-15-500" className="text-letter">
                    {item?.label}
                  </Text>
                </Checkbox>
              );
            })}
          </CheckboxGroup>
        </div>
      </AccordionCustom>

      {/* Level Filter */}
      <AccordionCustom
        isMobile={isMobile}
        title={
          <Text type="font-18-600" className="text-letter">
            {t('listCourse.level')}
          </Text>
        }
      >
        <div className="flex flex-col gap-4">
          <InputText
            onChange={onSearchLevel}
            isFilter
            placeholder={t('listCourse.searchPlaceholder')}
          />
          <CheckboxGroup size="lg" radius="sm" value={params.levels}>
            {levels?.map((item: any) => {
              return (
                <Checkbox
                  classNames={{
                    wrapper: 'me-3 after:!bg-main before:!border-black-7',
                    base: '',
                  }}
                  value={item?.value}
                  onChange={(e: any) => {
                    handleFilterChange('levels', e.target.value);
                  }}
                >
                  <Text type="font-15-500" className="text-letter">
                    {item?.label}
                  </Text>
                </Checkbox>
              );
            })}
          </CheckboxGroup>
        </div>
      </AccordionCustom>

      {/* Price Filter */}
      <AccordionCustom
        isMobile={isMobile}
        title={
          <Text type="font-18-600" className="text-letter">
            {t('listCourse.price')}
          </Text>
        }
      >
        <div className="flex flex-col gap-4">
          <InputText
            onChange={onSearchPrice}
            isFilter
            placeholder={t('listCourse.searchPlaceholder')}
          />
          <CheckboxGroup size="lg" radius="sm" value={params.prices}>
            {pricesData?.map((item: any) => {
              return (
                <Checkbox
                  classNames={{
                    wrapper: 'me-3 after:!bg-main before:!border-black-7',
                    base: '',
                  }}
                  value={item?.value}
                  onChange={(e: any) => {
                    handleFilterChange('prices', e.target.value);
                  }}
                >
                  <Text type="font-15-500" className="text-letter">
                    {item?.label}
                  </Text>
                </Checkbox>
              );
            })}
          </CheckboxGroup>
        </div>
      </AccordionCustom>

      {/* Mobile Clear Filter Button */}
      {isMobile && (
        <div className="flex items-center px-2 gap-3">
          <button
            className="bg-main rounded min-h-[44px] w-full"
            onClick={() => {
              onCloseModalFilter && onCloseModalFilter();
              setShowMobileFilters && setShowMobileFilters(false);
              setSearchQuery('');
              setParams({
                page: 1,
                pageSize: 3,
              });
              // Clear search from URL
              const currentQuery = { ...router.query };
              delete currentQuery.keySearch;
              router.push({
                pathname: router.pathname,
                query: currentQuery,
              });
            }}
          >
            <Text type="font-14-500" className="text-letter">
              {t('listCourse.clearFilter')}
            </Text>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters - Always visible */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Mobile Filter Sidebar */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-120 bg-card shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header with Search Field */}
              <div className="flex flex-col border-b border-white-10">
                {/* Header */}
                <div className="flex items-center justify-between p-4">
                  <Text type="font-18-600" className="text-letter">
                    {t('listCourse.filters')}
                  </Text>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-white-10 rounded-full transition-colors"
                  >
                    <IconClose />
                  </button>
                </div>

                {/* Search Field - Mobile Only */}
                <div className="px-4 pb-4">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <IconSearch />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      placeholder={t('listCourse.searchPlaceholder')}
                      className="w-full pl-10 pr-4 py-3 bg-white-10 border border-white-20 rounded-lg text-white placeholder-white-50 focus:outline-none focus:border-main transition-colors"
                    />
                  </form>
                </div>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <FilterContent />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default FilterCourse;
