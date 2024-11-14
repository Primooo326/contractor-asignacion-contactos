export interface IResponseApi<T> {
  data: T[];
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface IResponseApiOne<T> {
  data: T;
  statusCode: string;
  message: string;
}

export interface IResponseAuth<T> {
  resetPass: boolean;
  token: string;
  user: any;
}

export interface IParamsRequest {
  page?: number;
  limit?: number;
}
