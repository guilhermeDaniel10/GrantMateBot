
export interface IKafkaStreamResultDTO {
  success: boolean;
  payload: any | null;
  correlation_id?: number;
  date: Date;
}
