import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useRequest } from 'ahooks';

export interface Config {
  logo: string;
  color: string;
  langs: string[];
}

export interface DataConfig {
  id: string;
  logo: string;
  color: string;
  langs: string[];
  code: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const themeServices = {
  createTheme: async (body: Config) => {
    return await privateRequest(request.post, API_PATH.THEMES, {
      data: body,
    });
  },
  getDetail: async () => {
    return await privateRequest(request.get, API_PATH.THEME_DETAIL);
  },
  getKolTheme: async (id: string) => {
    return await privateRequest(request.get, API_PATH.THEMES + `/${id}`);
  },
  updateTheme: async (id: string, body: Config) => {
    return await privateRequest(request.patch, API_PATH.THEMES + `/${id}`, {
      data: body,
    });
  },
};

export const useGetDetailTheme = () => {
  const { loading, run, data } = useRequest(themeServices.getDetail);
  const dataConfig = data?.data as DataConfig;
  return { loading, run, data: dataConfig };
};

export const useCreateTheme = (options: IOptions) => {
  const { loading, run } = useRequest(
    async (body: Config) => {
      return await themeServices.createTheme(body);
    },
    {
      manual: true,
      ...options,
    }
  );
  return { loading, run };
};

export const useUpdateTheme = (options: IOptions) => {
  const { loading, run } = useRequest(
    async (id: string, body: Config) => {
      return await themeServices.updateTheme(id, body);
    },
    {
      manual: true,
      ...options,
    }
  );
  return { loading, run };
};
