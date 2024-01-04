export interface ApiError {
  status: number;
  message: string;
  meta: Array<any>;
}
