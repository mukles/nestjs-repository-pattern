import { useEffect, useState } from 'react';
import { AuthSession } from '../types/auth';

interface UseGetFetchUserProps {
  userId: number;
  skip: boolean;
  setSession: (session: AuthSession | null) => void;
}

export const useGetFetchUser = ({
  userId,
  skip,
  setSession,
}: UseGetFetchUserProps) => {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (skip) return;

    // This is a skeleton for fetching user data.
    // In a real application, you would use an API client or library like React Query/SWR.
    const fetchUser = async () => {
      try {
        // Mock successful fetch
        setIsSuccess(true);
      } catch (error: unknown) {
        // Use unknown for caught errors
        setIsSuccess(false);
        let errorMessage = 'Failed to fetch user';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        setSession({
          user: null,
          status: 'unauthenticated',
          error: errorMessage,
        });
      }
    };

    fetchUser();
  }, [userId, skip, setSession]);

  return {
    refetch: () => setIsSuccess(false),
    isSuccess,
  };
};
