import { ApiResponse, ErrorType } from "@repo/shared-types";
import { useActionState, useEffect } from "react";

type MutationCallbacks<T> = {
  onSuccess?: (result: T) => void;
  onError?: (error: {
    success: false;
    error: {
      type: ErrorType;
      message: string;
      details?: Record<string, any>;
    };
  }) => void;
};

export function useMutation<T>(
  actionFunction: (
    state: ApiResponse<T>,
    formData: FormData,
  ) => Promise<ApiResponse<T>>,
  props?: MutationCallbacks<T>,
): {
  action: (formData: FormData) => void;
  isPending: boolean;
  state: ApiResponse<T>;
} {
  const [state, action, isPending] = useActionState(actionFunction, null);

  useEffect(() => {
    if (state?.success === true && props?.onSuccess) {
      props.onSuccess(state.data!);
    }
    if (state?.success === false && props?.onError) {
      // @ts-ignore
      props.onError(state);
    }
  }, [state]);

  return {
    action: action,
    isPending: isPending,
    state: state,
  };
}
