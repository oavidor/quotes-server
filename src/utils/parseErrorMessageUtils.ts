type ExceptionError =
  | { error_code?: string; message?: string }
  | Error
  | unknown;

export const parseErrorMessage = (
  error: ExceptionError,
  customMessage = '',
): string => {
  const errorCode = (error as any)?.error_code ?? 'unknown error code';
  const errorMessage = (error as any)?.message ?? 'unknown message';

  return `${customMessage}, error code: ${errorCode}, message: ${errorMessage}`;
};
