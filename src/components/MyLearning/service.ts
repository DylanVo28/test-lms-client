/* eslint-disable require-await */
import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useInfiniteScroll, useRequest } from 'ahooks';
import { useMemo } from 'react';

const getListUserCourse = async (params: any) => {
  return await privateRequest(request.get, API_PATH.MY_LEARNINGS, { params });
};

export const useGetListUserCourse = (initialParams: any) => {
  const memoizedParams = useMemo(() => initialParams, [initialParams]);
  const { data, loading, loadMore, loadingMore, noMore, reload } =
    useInfiniteScroll(
      async (lastData) => {
        const currentPage = lastData?.page || 0; // Default to page 1 if no data yet
        const nextPage = currentPage + 1;
        // console.log('lastData', lastData);

        const response = await getListUserCourse({
          ...memoizedParams,
          page: nextPage,
        });
        // console.log('lastData', lastData, response);

        return {
          list: [...(response.data || [])],
          page: nextPage,
          total: response?.meta?.totalRecord,
          totalPage: response?.meta?.totalPage,
        };
      },
      {
        isNoMore: (d) => {
          return d ? d.page >= d.totalPage : false;
        },
      }
    );

  return {
    reload,
    list: data?.list || [],
    loadMore,
    loading,
    loadingMore,
    noMore,
  };
};

const getListWishList = async (params: any) => {
  return await privateRequest(request.get, API_PATH.WISH_LISH, { params });
};

export const useGetListWishList = (initialParams: any) => {
  const memoizedParams = useMemo(() => initialParams, [initialParams]);
  const { data, loading, loadMore, loadingMore, noMore, reload } =
    useInfiniteScroll(
      async (lastData) => {
        const currentPage = lastData?.page || 0; // Default to page 1 if no data yet
        const nextPage = currentPage + 1;
        // console.log('lastData', lastData);

        const response = await getListWishList({
          ...memoizedParams,
          page: nextPage,
        });
        // console.log('lastData', lastData, response);

        return {
          list: [...(response.data || [])],
          page: nextPage,
          total: response?.meta?.totalRecord,
          totalPage: response?.meta?.totalPage,
        };
      },
      {
        isNoMore: (d) => {
          return d ? d.page >= d.totalPage : false;
        },
      }
    );

  return {
    reload,
    list: data?.list || [],
    loadMore,
    loading,
    loadingMore,
    noMore,
  };
};

const serviceGetMyCertificates = async () => {
  // const params = {
  //   order: 'createdAt desc',
  //   page: 1,
  //   pageSize: 30,
  // };
  return await privateRequest(request.get, `${API_PATH.LIST_CERTIFICATES}`);
};

export const useGetMyCertificates = (options?: IOptions) => {
  const { data, loading, run, mutate } = useRequest(
    async () => {
      return serviceGetMyCertificates();
    },
    {
      ...options,
    }
  );

  return {
    mutate,
    dataListCertificates: data,
    run,
    loading,
  };
};
