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
  const { params, setParams, isMobile, onCloseModalFilter } = props;
  const [expanded, setExpanded] = useState(false);
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

  return (
    <div className="flex flex-col gap-5 mx-[-8px]">
      <AccordionCustom
        isMobile={isMobile}
        title={
          <Text type="font-18-600" className="text-letter">
            {'Rating'}
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
                  onCloseModalFilter && onCloseModalFilter();

                  setParams({
                    ...params,
                    ratings: e.target.value,
                  });
                }}
              >
                <div className="flex items-center gap-2">
                  <Rater total={5} rating={item?.value} />
                  <Text className="text-letter" type="font-14-400">
                    {item?.label}
                  </Text>
                  {/* <Text className="text-letter/70" type="font-14-400">
                    ({item?.total})
                  </Text> */}
                </div>
              </Radio>
            );
          })}
        </RadioGroup>
      </AccordionCustom>
      <AccordionCustom
        isMobile={isMobile}
        title={
          <div className="flex items-center gap-2">
            <Text type="font-18-600" className="text-letter">
              {'Language'}
            </Text>
            {/* <TagCount count={2} /> */}
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <InputText
            onChange={onSearchLanguages}
            isFilter
            placeholder={'Search...'}
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
                      {
                        onCloseModalFilter && onCloseModalFilter();

                        const idx = params.langs.findIndex(
                          (p: any) => p === e.target.value
                        );
                        if (idx >= 0) {
                          const newItems = params.langs.filter(
                            (p: any) => p !== e.target.value
                          );
                          setParams({
                            ...params,
                            langs: [...newItems],
                          });
                        } else {
                          setParams({
                            ...params,
                            langs: [...params.langs, e.target.value],
                          });
                        }
                      }
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

          {/* <Button
            variant="light"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            radius="full"
            className={clsx('w-max hover:bg-main-20', {
              ['mt-[-8px]']: !expanded,
            })}
          >
            <div className="flex items-center gap-[2px]">
              <Text type="font-14-500" className="text-main">
                {expanded ? 'See Less' : 'See More'}
              </Text>
              <Image
                src={'/icons/ic-arrow-drop-right-line.svg'}
                width={20}
                className={clsx('transition-transform duration-300', {
                  ['rotate-180']: expanded,
                })}
                height={20}
                alt=""
              />
            </div>
          </Button> */}
        </div>
      </AccordionCustom>
      <AccordionCustom
        isMobile={isMobile}
        title={
          <div className="flex items-center gap-2">
            <Text type="font-18-600" className="text-letter">
              {'Hands-on Practice'}
            </Text>
            {/* <TagCount count={1} /> */}
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <InputText
            onChange={onSearchFeatures}
            isFilter
            placeholder={'Search...'}
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
                    onCloseModalFilter && onCloseModalFilter();

                    {
                      const idx = params.features.findIndex(
                        (p: any) => p === e.target.value
                      );
                      if (idx >= 0) {
                        const newItems = params.features.filter(
                          (p: any) => p !== e.target.value
                        );
                        setParams({
                          ...params,
                          features: [...newItems],
                        });
                      } else {
                        setParams({
                          ...params,
                          features: [...params.features, e.target.value],
                        });
                      }
                    }
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
      <AccordionCustom
        isMobile={isMobile}
        title={
          <Text type="font-18-600" className="text-letter">
            {'Topic'}
          </Text>
        }
      >
        <div className="flex flex-col gap-4">
          <InputText
            onChange={onSearchTopic}
            isFilter
            placeholder={'Search...'}
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
                    onCloseModalFilter && onCloseModalFilter();

                    const idx = params.topics.findIndex(
                      (p: any) => p === e.target.value
                    );
                    if (idx >= 0) {
                      const newItems = params.topics.filter(
                        (p: any) => p !== e.target.value
                      );
                      setParams({
                        ...params,
                        topics: [...newItems],
                      });
                    } else {
                      setParams({
                        ...params,
                        topics: [...params.topics, e.target.value],
                      });
                    }
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
      <AccordionCustom
        isMobile={isMobile}
        title={
          <Text type="font-18-600" className="text-letter">
            {'Level'}
          </Text>
        }
      >
        <div className="flex flex-col gap-4">
          <InputText
            onChange={onSearchLevel}
            isFilter
            placeholder={'Search...'}
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
                    onCloseModalFilter && onCloseModalFilter();

                    const idx = params.levels.findIndex(
                      (p: any) => p === e.target.value
                    );
                    if (idx >= 0) {
                      const newItems = params.levels.filter(
                        (p: any) => p !== e.target.value
                      );
                      setParams({
                        ...params,
                        levels: [...newItems],
                      });
                    } else {
                      setParams({
                        ...params,
                        levels: [...params.levels, e.target.value],
                      });
                    }
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
      <AccordionCustom
        isMobile={isMobile}
        title={
          <Text type="font-18-600" className="text-letter">
            {'Price'}
          </Text>
        }
      >
        <div className="flex flex-col gap-4">
          <InputText
            onChange={onSearchPrice}
            isFilter
            placeholder={'Search...'}
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
                    const idx = params.prices.findIndex(
                      (p: any) => p === e.target.value
                    );
                    onCloseModalFilter && onCloseModalFilter();

                    if (idx >= 0) {
                      const newPrices = params.prices.filter(
                        (p: any) => p !== e.target.value
                      );
                      setParams({
                        ...params,
                        prices: [...newPrices],
                      });
                    } else {
                      setParams({
                        ...params,
                        prices: [...params.prices, e.target.value],
                      });
                    }
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

      {isMobile && (
        <div className="flex items-center px-2 gap-3">
          <button
            className="bg-main rounded min-h-[44px] w-full"
            onClick={() => {
              onCloseModalFilter && onCloseModalFilter();
              setParams({
                page: 1,
                pageSize: 3,
              });
            }}
          >
            <Text type="font-14-500" className="text-letter">
              {'Clear filter'}
            </Text>
          </button>
        </div>
      )}
    </div>
  );
};
export default FilterCourse;
