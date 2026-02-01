'use server';
import 'server-only';

import { createSession, deleteSession } from '@/lib/session';
import { loginUserSchema } from '@/lib/validation/user.schema';
import { redirect } from 'next/navigation';
import { apiAction, Result, safeAction } from '../common';
import { AuthResponse } from './types';

export const loginUser = async (
  _state: Result<AuthResponse>,
  formData: FormData,
) => {
  return safeAction(async () => {
    try {
      const data = Object.fromEntries(formData);
      const validatedData = loginUserSchema.parse(data);
      const response = await apiAction<AuthResponse>('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      await createSession(response.accessToken, response.refreshToken);

      return response;
    } catch (error) {
      console.error('Login Error:', error);
    }
  });
};

export async function logout() {
  await deleteSession();
  redirect('/login');
}
