export interface ApiError {
  statusCode: number;
  message: string;
  meta: Array<any>;
}
