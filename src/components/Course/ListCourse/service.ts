/* eslint-disable require-await */
import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useProfile } from '@/store/profile/useProfile';
import { useRequest } from 'ahooks';
import { useMemo, useState, useCallback } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';

const getListCourse = async (params: any) => {
  return await privateRequest(request.get, API_PATH.LIST_COURSE, { params });
};

export const useGetListCourse = (initialParams: any) => {
  const { profile } = useProfile();
  const enabled = Boolean(initialParams?.authors);

  const query = useInfiniteQuery({
    queryKey: ['courses', initialParams, profile?.id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getListCourse({
        ...initialParams,
        page: pageParam,
        userId: profile?.id,
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPage = lastPage?.meta?.totalPage || 0;
      const next = allPages.length + 1;
      return allPages.length < totalPage ? next : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled,
  });

  const dataCourses = (query.data?.pages || []).flatMap((p: any) => p?.data || []);
  // Only treat cold start as loading; keep cached data visible during background refetch
  const loading = query.isLoading;
  const loadingMore = query.isFetchingNextPage;
  const isFetching = query.isFetching || query.isRefetching;
  const noMore = !query.hasNextPage;

  return {
    reload: () => query.refetch(),
    dataCourses,
    loadMore: () => query.fetchNextPage(),
    loading,
    loadingMore,
    noMore,
    isFetching,
  };
};

const getListMyCourse = async (params: any) => {
  return await privateRequest(request.get, API_PATH.MY_COURSE, { params });
};

export const useGetListMyCourse = (initialParams: any) => {
  const { profile } = useProfile();
  const memoizedParams = useMemo(
    () => initialParams,
    [JSON.stringify(initialParams)]
  );

  const query = useInfiniteQuery({
    queryKey: ['myCourses', memoizedParams, profile?.id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getListMyCourse({
        ...memoizedParams,
        page: pageParam,
        userId: profile?.id,
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPage = lastPage?.meta?.totalPage || 0;
      const next = allPages.length + 1;
      return allPages.length < totalPage ? next : undefined;
    },
    initialPageParam: 1,
    enabled: Boolean(profile?.id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const dataCourses = useMemo(() => {
    return (query.data?.pages || []).flatMap((page: any) => page?.data || []);
  }, [query.data]);
  const loading = query.isLoading && !query.data;
  const loadingMore = query.isFetchingNextPage;
  const noMore = !query.hasNextPage;

  return {
    reload: () => query.refetch(),
    dataCourses,
    loadMore: () => query.fetchNextPage(),
    loading,
    loadingMore,
    noMore,
  };
};

interface IBodyComment {
  parentId?: string;
  content: string;
}
const serviceCommentCours = async (body: IBodyComment, id: string) => {
  return privateRequest(request.post, API_PATH.COMMENT_COURSE(id), {
    data: body,
  });
};

export const useCommentCours = (options?: IOptions) => {
  return useRequest(serviceCommentCours, { manual: true, ...options });
};

const serviceReviewCours = async (body: any, id: string) => {
  return privateRequest(request.post, API_PATH.REVIEW_COURSE(id), {
    data: body,
  });
};

export const useReviewCours = (options?: IOptions) => {
  return useRequest(serviceReviewCours, { manual: true, ...options });
};

const serviceRemoveLikeComment = async (id: string) => {
  return privateRequest(request.delete, API_PATH.REMOVE_LIKE_COMMENT(id));
};

export const useRemoveLikeComment = (options?: IOptions) => {
  return useRequest(serviceRemoveLikeComment, { manual: true, ...options });
};

const serviceLikeComment = async (body: any, id: string) => {
  return privateRequest(request.post, API_PATH.LIKE_COMMENT(id), {
    data: body,
  });
};

export const useLikeComment = (options?: IOptions) => {
  return useRequest(serviceLikeComment, { manual: true, ...options });
};

const serviceUnLikeComment = async (id: string) => {
  return privateRequest(request.delete, API_PATH.UN_LIKE_COMMENT(id), {});
};

export const useUnLikeComment = (options?: IOptions) => {
  return useRequest(serviceUnLikeComment, { manual: true, ...options });
};

const serviceLikeReview = async (body: any) => {
  return privateRequest(request.post, API_PATH.LIKE_REVIEW, {
    data: body,
  });
};

export const useLikeReview = (options?: IOptions) => {
  return useRequest(serviceLikeReview, { manual: true, ...options });
};
const serviceGetListComment = async (id: string) => {
  const params = {
    order: 'createdAt desc',
    page: 1,
    pageSize: 30,
  };
  return await privateRequest(request.get, `${API_PATH.LIST_COMMENT(id)}`, {
    params,
  });
};

export const useGetListComment = (options?: IOptions) => {
  const { data, loading, run, mutate } = useRequest(
    async (id: string) => {
      return serviceGetListComment(id);
    },
    {
      ...options,
    }
  );

  return {
    mutate,
    dataListComment: data,
    run,
    loading,
  };
};

interface IFilter {
  page?: number;
  level?: number;
  pageSize?: number;
  search?: string;
}

const serviceGetListReview = async (id: string, filter?: IFilter) => {
  const params = {
    order: 'createdAt desc',
    page: 1,
    pageSize: 30,
    search: filter?.search || '',
    level: filter?.level,
  };
  return await privateRequest(request.get, `${API_PATH.LIST_REVIEW(id)}`, {
    params,
  });
};

export const useGetListReview = (options?: IOptions) => {
  const queryClient = useQueryClient();
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [currentFilter, setCurrentFilter] = useState<IFilter | undefined>(undefined);

  const query = useQuery({
    queryKey: ['reviews', currentId, currentFilter],
    queryFn: async () => {
      if (!currentId) return null;
      return serviceGetListReview(currentId, currentFilter);
    },
    enabled: !!currentId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });

  const run = useCallback((id: string, filter?: IFilter) => {
    setCurrentId(id);
    setCurrentFilter(filter);
  }, []);

  const onChange = useCallback((id: string, filter?: IFilter) => {
    run(id, filter);
  }, [run]);

  const mutate = useCallback((newData: any) => {
    if (currentId) {
      queryClient.setQueryData(['reviews', currentId, currentFilter], newData);
    }
  }, [currentId, currentFilter, queryClient]);

  return {
    mutate,
    dataListReview: query.data,
    run,
    onChange,
    loading: query.isLoading,
  };
};

const serviceListReviewSummary = async (id: string) => {
  // const params = {
  //   order: 'createdAt desc',
  //   page: 1,
  //   pageSize: 30,
  // };
  return await privateRequest(
    request.get,
    `${API_PATH.LIST_REVIEW_SUMMARY(id)}`
  );
};

export const useGetListReviewSummary = (options?: IOptions) => {
  const { data, loading, run, mutate } = useRequest(
    async (id: string) => {
      return serviceListReviewSummary(id);
    },
    {
      manual: true,
      ...options,
    }
  );

  return {
    mutate,
    dataListReviewSummary: data,
    run,
    loading,
  };
};
