'use server';
import 'server-only';

import { apiAction, Result, safeAction } from './common';
import { loginUserSchema } from '@/lib/validation/user.schema';
import { deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export const loginUser = async (state: Result<any>, formData: FormData) => {
  return safeAction<any>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = loginUserSchema.parse(data);
    return await apiAction<any>('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });
  });
};

export async function logout() {
  await deleteSession();
  redirect('/login');
}
