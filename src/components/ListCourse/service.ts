/* eslint-disable require-await */
import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useRequest } from 'ahooks';

const getListCourse = async () => {
  return await privateRequest(request.get, API_PATH.MY_COURSE);
};

export const useGetListCourse = () => {
  const { data, loading, run, refreshAsync } = useRequest(async () => {
    return await getListCourse();
  });

  return {
    dataCourses: data,
    run,
    loading,
    refreshAsync,
  };
};
