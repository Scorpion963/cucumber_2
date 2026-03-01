
export type SuccessfulResponseType<T> = {
  success: true;
  data: T;
};

export type UnsuccessfulResponseType<E> = {
  success: false;
  error: E;
};

export type ErrorType = {
  code: string;
  message: string;
};

export type ResponseType<T, E = ErrorType> =
  | SuccessfulResponseType<T>
  | UnsuccessfulResponseType<E>;