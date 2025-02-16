import { atom } from 'jotai';

export interface InitProfile {
  loading: boolean;
  avatar: string;
  email: string;
  id: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  walletAddress?: string;
}

export const initialProfile: InitProfile = {
  loading: true,
  avatar: '',
  email: '',
  id: '',
  firstName: '',
  lastName: '',
  role: '',
  walletAddress: '',
};

export const profileAtom = atom({
  ...initialProfile,
});
