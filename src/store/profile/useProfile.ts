/* eslint-disable require-await */
import { useAtom } from 'jotai';

import { profileAtom } from './profile';

export const useProfile = () => {
  const [profile, setProfile] = useAtom(profileAtom);

  return {
    setProfile,
    profile,
  };
};
