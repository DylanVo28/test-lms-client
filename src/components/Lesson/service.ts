import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useRequest } from 'ahooks';

export const useGetLessons = (options?: IOptions) => {
  const { data, loading, run } = useRequest(
    async (id: string) => {
      return await serviceGetLessons(id);
    },
    {
      manual: true,
      ...options,
    }
  );

  return {
    manual: true,
    dataLesson: data,
    run,
    loading,
  };
};

const serviceGetLessons = async (id: string) => {
  return await privateRequest(request.get, `${API_PATH.LECTURE}/${id}`, {});
};

export const useGetQuizz = (options?: IOptions) => {
  const { data, loading, run } = useRequest(
    async (id: string) => {
      return await serviceGetQuizz(id);
    },
    {
      manual: true,
      ...options,
    }
  );

  return {
    dataQuizz: data,
    run,
    loading,
  };
};

const serviceGetQuizz = async (id: string) => {
  return await privateRequest(request.get, `${API_PATH.QUIZZ}/${id}`, {});
};

const serviceProgressStatusQuizz = (body: any, id: string) => {
  return privateRequest(request.patch, API_PATH.PROGRESS_QUIZZ(id), {
    data: body,
  });
};

export const useProgressStatusQuizz = (options: any) => {
  return useRequest(serviceProgressStatusQuizz, {
    manual: true,
    ...options,
  });
};

const serviceProgressStatusLesson = (body: any, id: string) => {
  return privateRequest(request.patch, API_PATH.PROGRESS_LESSON(id), {
    data: body,
  });
};

export const useProgressStatusLesson = (options: any) => {
  return useRequest(serviceProgressStatusLesson, {
    manual: true,
    ...options,
  });
};
