/* eslint-disable require-await */
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { useRequest } from 'ahooks';

const serviceGetCategories = async (params: any) => {
  return await privateRequest(request.get, API_PATH.CATEGORIES, {
    params: {
      ...params,
      pageSize: 50,
    },
  });
};

export const useGetCategories = (params: any = {}) => {
  const { data, loading, run } = useRequest(async () => {
    return await serviceGetCategories(params);
  });

  return {
    data,
    run,
    loading,
  };
};

const serviceGetPrices = async () => {
  return await privateRequest(request.get, API_PATH.FILTER_PRICE, {});
};

export const useGetPrices = () => {
  const { data, loading, run } = useRequest(async () => {
    return await serviceGetPrices();
  });

  return {
    data,
    run,
    loading,
  };
};

const serviceGetTopics = async () => {
  return await privateRequest(request.get, API_PATH.FILTER_TOPIC, {});
};

export const useGetTopics = () => {
  const { data, loading, run } = useRequest(async () => {
    return await serviceGetTopics();
  });

  return {
    data,
    run,
    loading,
  };
};

const serviceGetLevels = async () => {
  return await privateRequest(request.get, API_PATH.FILTER_LEVEL, {});
};

export const useGetLevels = () => {
  const { data, loading, run } = useRequest(async () => {
    return await serviceGetLevels();
  });

  return {
    data,
    run,
    loading,
  };
};

const serviceGetLanguages = async () => {
  return await privateRequest(request.get, API_PATH.FILTER_LANGUAGE, {});
};

export const useGetLanguages = () => {
  const { data, loading, run } = useRequest(async () => {
    return await serviceGetLanguages();
  });

  return {
    data,
    run,
    loading,
  };
};

const serviceGetVideoDurations = async () => {
  return await privateRequest(request.get, API_PATH.FILTER_VIDEO_DURATION, {});
};

export const useGetVideoDurations = () => {
  const { data, loading, run } = useRequest(async () => {
    return await serviceGetVideoDurations();
  });

  return {
    data,
    run,
    loading,
  };
};

const serviceGetRatings = async () => {
  return await privateRequest(request.get, API_PATH.FILTER_RATING, {});
};

export const useGetRatings = () => {
  const { data, loading, run } = useRequest(async () => {
    return await serviceGetRatings();
  });

  return {
    data,
    run,
    loading,
  };
};

const serviceGetFeatures = async () => {
  return await privateRequest(request.get, API_PATH.FILTER_FEATURES, {});
};

export const useGetFeatures = () => {
  const { data, loading, run } = useRequest(async () => {
    return await serviceGetFeatures();
  });

  return {
    data,
    run,
    loading,
  };
};
