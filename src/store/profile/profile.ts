import { atom } from 'jotai';

export interface InitProfile {
  loading: boolean;
  avatar: string;
  email: string;
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  walletAddress: string;
  withdrawable: number;
  refererCode: string;
  refererThemeCode: string;
  orderlyAccountId: string;
  orderlyKey: string;
  orderlySecretKey: string;
}

export const initialProfile: InitProfile = {
  loading: true,
  avatar: '',
  email: '',
  id: '',
  fullName: '',
  firstName: '',
  lastName: '',
  role: '',
  walletAddress: '',
  withdrawable: 0,
  refererCode: '',
  refererThemeCode: '',
  orderlyAccountId: '',
  orderlyKey: '',
  orderlySecretKey: '',
};

export const profileAtom = atom({
  ...initialProfile,
});
