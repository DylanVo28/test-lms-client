import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useProfile } from '@/store/profile/useProfile';
import { useRequest } from 'ahooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';

const serviceGetCategories = async (params: any) => {
  return await privateRequest(request.get, API_PATH.CATEGORIES, {
    params: {
      ...params,
      pageSize: 50,
    },
  });
};

export const useGetCategories = (params?: any) => {
  const { data, loading, run } = useRequest(async () => {
    return await serviceGetCategories(params);
  });

  return {
    dataCategories: data,
    run,
    loading,
  };
};

const serviceGetSubCategories = async (id: string) => {
  const params = {
    categoryId: id,
    pageSize: 50,
  };
  return await privateRequest(request.get, API_PATH.SUB_CATEGORIES, { params });
};

export const useGetSubCategories = () => {
  const { data, loading, run } = useRequest(
    async (id: string) => {
      return await serviceGetSubCategories(id);
    },
    {
      manual: true,
    }
  );

  return {
    dataSubCategories: data,
    run,
    loading,
  };
};

interface IBody {
  categoryId: string;
  timeSpent: string;
  title: string;
  type: string;
}

const serviceCreateCourse = async (body: IBody) => {
  return privateRequest(request.post, API_PATH.CREATE_COURSE, { data: body });
};

export const useCreateCourse = (options?: IOptions) => {
  return useRequest(serviceCreateCourse, { manual: true, ...options });
};

const serviceDuplicateCourse = async (id: string) => {
  return privateRequest(
    request.post,
    `${API_PATH.CREATE_COURSE}/${id}/duplicate`,
    { data: {} }
  );
};

export const useDuplicateCourse = (options?: IOptions) => {
  return useRequest(serviceDuplicateCourse, { manual: true, ...options });
};

const getDetailCourse = async (id: string, userId?: string): Promise<any> => {
  return privateRequest(request.get, `${API_PATH.CREATE_COURSE}/${id}`, {
    params: { userId },
  });
};

export const useGetDetailCourse = (options?: IOptions) => {
  return useRequest(getDetailCourse, { manual: true, ...options });
};

// TanStack Query version for caching across navigations
export const useGetDetailCourseQuery = (
  id?: string,
  userId?: string,
  options?: any
) => {
  return useQuery<any>({
    queryKey: ['courseDetail', id, userId],
    queryFn: () => getDetailCourse(id as string, userId),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2, // 2 minutes cache fresh
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    ...options,
  });
};

const serviceEditCourse = (body: any, id: string) => {
  return privateRequest(request.patch, API_PATH.EDIT_COURSE(id), {
    data: body,
  });
};

export const useEditCourse = (options: any) => {
  return useRequest(serviceEditCourse, {
    manual: true,
    ...options,
  });
};

const serviceDeleteCourse = (id: string) => {
  return privateRequest(request.delete, API_PATH.EDIT_COURSE(id));
};

export const useDeleteCourse = (options: any) => {
  return useRequest(serviceDeleteCourse, {
    manual: true,
    ...options,
  });
};

const getListSession = async (id: string, userId: string): Promise<any> => {
  const params = {
    courseId: id,
    ownerId: userId,
    order: 'createdAt asc',
  };
  return privateRequest(request.get, `${API_PATH.SECTIONS}`, { params });
};

// TanStack Query version for caching and automatic refetching
export const useGetListSession = (options?: IOptions) => {
  const [courseId, setCourseId] = useState<string | undefined>(undefined);
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined);
  
  // Use refs to store callbacks to avoid infinite loops
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  const lastDataUpdatedAtRef = useRef<number>(0);

  // Update refs when options change
  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);
  const query = useQuery<any>({
    queryKey: ['sections', courseId, ownerId],
    queryFn: () => getListSession(courseId!, ownerId!),
    enabled: Boolean(courseId && ownerId),
  });

  // Handle onSuccess callback if provided - only call when data is actually updated
  useEffect(() => {
    if (
      query.isSuccess &&
      query.data &&
      !query.isFetching &&
      onSuccessRef.current &&
      query.dataUpdatedAt > lastDataUpdatedAtRef.current
    ) {
      lastDataUpdatedAtRef.current = query.dataUpdatedAt;
      onSuccessRef.current(query.data);
    }
  }, [query.isSuccess, query.data, query.isFetching, query.dataUpdatedAt]);

  // Handle onError callback if provided
  useEffect(() => {
    if (query.error && onErrorRef.current && !query.isFetching) {
      onErrorRef.current(query.error);
    }
  }, [query.error, query.isFetching]);

  // For backward compatibility, provide run method
  const run = (id: string, userId: string) => {
    // Reset dataUpdatedAt tracking when params change
    lastDataUpdatedAtRef.current = 0;
    setCourseId(id);
    setOwnerId(userId);
    // Query will automatically refetch when courseId/ownerId change
  };

  return {
    data: query.data,
    loading: query.isLoading,
    refetch: query.refetch,
    run,
  };
};

interface IBodyLesson {
  title: string;
  courseId: string;
  ordinalNumber?: number;
  learningObjective: string;
}

const serviceCreateSesson = async (body: IBodyLesson) => {
  return privateRequest(request.post, API_PATH.SECTIONS, { data: body });
};

export const useCreateSesson = (options?: IOptions) => {
  return useRequest(serviceCreateSesson, { manual: true, ...options });
};
const serviceEditSesson = async (body: IBodyLesson, id: string) => {
  return privateRequest(request.patch, `${API_PATH.SECTIONS}/${id}`, {
    data: body,
  });
};

export const useEditSesson = (options?: IOptions) => {
  return useRequest(serviceEditSesson, { manual: true, ...options });
};

const serviceDeleteSesson = async (id: string) => {
  return privateRequest(request.delete, `${API_PATH.SECTIONS}/${id}`);
};

export const useDeleteSesson = (options?: IOptions) => {
  return useRequest(serviceDeleteSesson, { manual: true, ...options });
};

interface IBodyLecture {
  title?: string;
  description?: string;
  ordinalNumber?: any;
  sectionId?: string;
  content?: string;
  contentType?: string;
  resources?: any;
}

const serviceEditQuizz = async (body: IBodyLecture, id: string) => {
  return privateRequest(request.patch, `${API_PATH.QUIZZ}/${id}`, {
    data: body,
  });
};

export const useEditQuizz = (options?: IOptions) => {
  return useRequest(serviceEditQuizz, { manual: true, ...options });
};

const serviceEditLecture = async (body: IBodyLecture, id: string) => {
  return privateRequest(request.patch, `${API_PATH.LECTURE}/${id}`, {
    data: body,
  });
};

export const useEditLecture = (options?: IOptions) => {
  return useRequest(serviceEditLecture, { manual: true, ...options });
};

const serviceDeleteLecture = async (id: string) => {
  return privateRequest(request.delete, `${API_PATH.LECTURE}/${id}`, {});
};

export const useDeleteLecture = (options?: IOptions) => {
  return useRequest(serviceDeleteLecture, { manual: true, ...options });
};

const serviceDeleteQuizz = async (id: string) => {
  return privateRequest(request.delete, `${API_PATH.QUIZZ}/${id}`, {});
};

export const useDeleteQuizz = (options?: IOptions) => {
  return useRequest(serviceDeleteQuizz, { manual: true, ...options });
};

const serviceCreateLecture = async (body: IBodyLecture) => {
  return privateRequest(request.post, API_PATH.LECTURE, { data: body });
};

export const useCreateLecture = (options?: IOptions) => {
  return useRequest(serviceCreateLecture, { manual: true, ...options });
};

interface IBodyQuizz {
  title: string;
  ordinalNumber?: number;
  description: string;
  sectionId: string;
}
const serviceCreateQuizz = async (body: IBodyQuizz) => {
  return privateRequest(request.post, API_PATH.QUIZZ, { data: body });
};

export const useCreateQuizz = (options?: IOptions) => {
  return useRequest(serviceCreateQuizz, { manual: true, ...options });
};

export const serviceUploadFile = async (file: any) => {
  const formData = new FormData();

  formData.append('file', file);

  return await privateRequest(request.post, API_PATH.UPLOAD_FILE, {
    data: formData,
  });
};

export const serviceUploadFileInBackground = async (file: any) => {
  const formData = new FormData();

  formData.append('file', file);

  return await privateRequest(
    request.post,
    API_PATH.UPLOAD_FILE_IN_BACKGROUND,
    {
      data: formData,
    }
  );
};

export const useUploadFile = (options?: IOptions) => {
  return useRequest(serviceUploadFile, {
    manual: true,
    ...options,
  });
};
export const uploadMultipleFiles = async (file1: any, file2: any) => {
  return await Promise.all([
    serviceUploadFile(file1),
    serviceUploadFile(file2),
  ]);
};
export const useUploadMultipleFiles = (options?: IOptions) => {
  return useRequest(
    (file1: any, file2: any) => uploadMultipleFiles(file1, file2),
    {
      manual: true,
      ...options,
    }
  );
};
interface answers {
  answer: string;
  isCorrect: boolean;
  explain: string;
}

interface IBodyQuestionQuizz {
  question: string;
  ordinalNumber?: number;
  answers: answers[];
}

interface answersEdit {
  answer: string;
  isCorrect: boolean;
  explain: string;
  id: string;
}

interface IBodyEditQuestionQuizz {
  question?: string;
  ordinalNumber?: number;
  answers?: answersEdit[];
}

const servicCreateQuestionQuizz = async (
  body: IBodyQuestionQuizz,
  id: string
) => {
  return privateRequest(request.post, `${API_PATH.QUESTION_QUIZZ(id)}`, {
    data: body,
  });
};

export const useCreateQuestionQuizz = (options?: IOptions) => {
  return useRequest(servicCreateQuestionQuizz, { manual: true, ...options });
};

const servicEditQuestionQuizz = async (
  body: IBodyEditQuestionQuizz,
  id: string
) => {
  return privateRequest(request.put, `${API_PATH.EDIT_QUESTION_QUIZZ(id)}`, {
    data: body,
  });
};

export const useEditQuestionQuizz = (options?: IOptions) => {
  return useRequest(servicEditQuestionQuizz, { manual: true, ...options });
};

const servicDeleteQuestionQuizz = async (id: string) => {
  return privateRequest(
    request.delete,
    `${API_PATH.EDIT_QUESTION_QUIZZ(id)}`,
    {}
  );
};

export const useDeleteQuestionQuizz = (options?: IOptions) => {
  return useRequest(servicDeleteQuestionQuizz, { manual: true, ...options });
};
