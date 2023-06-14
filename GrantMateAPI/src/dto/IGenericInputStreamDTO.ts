export interface IGenericInputStreamDTO {
  topic: string;
  streamType: string;
  payload: any;
  topicToConsume?: string;
}
