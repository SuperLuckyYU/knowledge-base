// import requestUmi from '@/utils/requestUmi';
import { get } from '@/utils/request';

type User = {
  userid: string;
  name: string;
  email: string;
  avatar: string;
};

type UserResponse = {
  status: 'success' | 'failed';
  user: User;
};

export async function fetchCurrentUser() {
  return get<UserResponse>('http://pandora.yidian-inc.com/api/user/getuser');

}

export async function fetchUserAuth() {
  return get<string[]>('http://pandora.yidian-inc.com/tools/auth/index?tool=3389842355');
}

