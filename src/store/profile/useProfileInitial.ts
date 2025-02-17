/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { profileAtom } from './profile';
import { API_PATH } from '@/api/constant';
import { PREFIX_API, privateRequest } from '@/api/request';

interface IOptions {
  onSuccess?: (r: any) => void;
}

export const useProfileInitial = (options?: IOptions) => {
  const [profile, setProfile] = useAtom(profileAtom);
  const run = () => {
    const init = async () => {
      try {
        const res = await privateRequest(
          fetch,
          `${PREFIX_API}${API_PATH.GET_USER}`
        ).then((res) => res.json());
        setProfile({
          ...res?.data,
        });
        options?.onSuccess?.(res);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  };

  return {
    profile,
    setProfile,
    requestGetProfile: run,
  };
};
