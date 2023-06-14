export interface IResponseDTO<T> {
  data: T;
  status: number;
  success: boolean;
}
