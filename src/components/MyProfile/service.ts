import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useProfile } from '@/store/profile/useProfile';

export const userRequest = {
  getMe(params?: any) {
    return privateRequest(request.get, API_PATH.USER_ME, { params });
  },
  update(body: any) {
    return privateRequest(request.patch, API_PATH.USER_UPDATE, { data: body });
  },

  getUserDetail(id: string, params: any) {
    // const { profile } = useProfile();
    // const accessToken = useAccessToken();
    // const params = {
    //   userId: accessToken ? profile?.id : '',
    // };
    return privateRequest(request.get, `${API_PATH.USER_DETAIL(id)}`, {
      params,
    });
  },
};

export const referralRequest = {
  getSummary() {
    return privateRequest(request.get, API_PATH.REFERRAL_SUMMARY);
  },
  getProfile() {
    return privateRequest(request.get, API_PATH.REFERRAL_PROFILE);
  },
};

export interface TUser {
  id: string;
  email: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string;
  avatar: string | null;
  walletAddress: string;
  headline: string | null;
  biography: string | null;
  websiteUrl: string | null;
  x: string | null;
  facebook: string | null;
  linkedin: string | null;
  youtube: string | null;
  createdAt: string;
  updatedAt: string;
  withdrawable: number;
}
