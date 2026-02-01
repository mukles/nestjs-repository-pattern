import { apiAction, safeAction } from '@/actions/common';
import { User } from './types';

export async function getUserProfile(userId: string) {
  return safeAction<User>(() => {
    return apiAction(`/user/${userId}/profile`, {
      method: 'GET',
      next: { tags: [`user-profile-${userId}`] },
    });
  });
}
