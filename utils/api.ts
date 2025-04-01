import { useRuntimeConfig } from "#app";

export const getApiUrl = (endpoint: string) => {
  const config = useRuntimeConfig();
  return `${config.public.apiBase}${endpoint}`;
};

export const handleApiResponse = (data: any, error: any) => {
  if (error.value) {
    return handleApiError(error.value);
  }
  return {
    success: true,
    data: data.value?.response,
    successMessage: "Operation successful",
  };
};

export const handleApiError = (error: any) => {
  if (error.statusCode === 422) {
    return {
      success: false,
      errors: error.data.errors,
      errorMessage: error.data.message,
    };
  } else if (error.statusCode === 401) {
    return { success: false, errorMessage: error.data.message };
  }
  return { success: false, errorMessage: "An unexpected error occurred" };
};
