/* eslint-disable require-await */
import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useMemo } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  UseMutationOptions,
} from '@tanstack/react-query';

const serviceMintCertificate = async (data: { to: string; certificateId: string; }) => {
  return privateRequest(request.post, API_PATH.MINT_CERTIFICATE, { data });
};

export const useMintCertificate = (
  options?: UseMutationOptions<any, unknown, { to: string; certificateId: string }>
) => {
  return useMutation({
    mutationFn: (variables) => serviceMintCertificate(variables),
    ...options,
  });
};

const getListUserCourse = async (params: any) => {
  return await privateRequest(request.get, API_PATH.MY_LEARNINGS, { params });
};

export const useGetListUserCourse = (initialParams: any) => {
  const memoizedParams = useMemo(() => initialParams, [initialParams]);

  const query = useInfiniteQuery({
    queryKey: ['myLearning', 'courses', memoizedParams],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getListUserCourse({ ...memoizedParams, page: pageParam });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPage = lastPage?.meta?.totalPage || 0;
      const next = allPages.length + 1;
      return allPages.length < totalPage ? next : undefined;
    },
    initialPageParam: 1,
  });

  const list = (query.data?.pages || []).flatMap((p: any) => p?.data || []);
  const noMore = !query.hasNextPage;
  const loading = query.isLoading || query.isRefetching;
  const loadingMore = query.isFetchingNextPage;

  return {
    reload: () => query.refetch(),
    list,
    loadMore: () => query.fetchNextPage(),
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

  const query = useInfiniteQuery({
    queryKey: ['myLearning', 'wishlist', memoizedParams],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getListWishList({ ...memoizedParams, page: pageParam });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPage = lastPage?.meta?.totalPage || 0;
      const next = allPages.length + 1;
      return allPages.length < totalPage ? next : undefined;
    },
    initialPageParam: 1,
  });

  const list = (query.data?.pages || []).flatMap((p: any) => p?.data || []);
  const noMore = !query.hasNextPage;
  const loading = query.isLoading || query.isRefetching;
  const loadingMore = query.isFetchingNextPage;

  return {
    reload: () => query.refetch(),
    list,
    loadMore: () => query.fetchNextPage(),
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
  const query = useQuery({
    queryKey: ['myLearning', 'certificates'],
    queryFn: () => serviceGetMyCertificates(),
    ...options,
  } as any);

  return {
    mutate: query.refetch,
    dataListCertificates: query.data,
    run: query.refetch,
    loading: query.isLoading || query.isRefetching,
  };
};

const getListFollower = async (params: any) => {
  return await privateRequest(request.get, API_PATH.LIST_FOLLOWER, { params });
};

export const useGetListFollowers = (initialParams: any) => {
  const memoizedParams = useMemo(() => initialParams, [initialParams]);

  const query = useInfiniteQuery({
    queryKey: ['myLearning', 'followers', memoizedParams],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getListFollower({ ...memoizedParams, page: pageParam });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPage = lastPage?.meta?.totalPage || 0;
      const next = allPages.length + 1;
      return allPages.length < totalPage ? next : undefined;
    },
    initialPageParam: 1,

  });

  const list = (query.data?.pages || []).flatMap((p: any) => p?.data || []);
  const noMore = !query.hasNextPage;
  const loading = query.isLoading || query.isRefetching;
  const loadingMore = query.isFetchingNextPage;

  return {
    reload: () => query.refetch(),
    list,
    loadMore: () => query.fetchNextPage(),
    loading,
    loadingMore,
    noMore,
  };
};
