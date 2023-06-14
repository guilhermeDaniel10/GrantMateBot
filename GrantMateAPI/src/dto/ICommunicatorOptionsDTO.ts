export interface ICommunicatorOptionsDTO {
  baseUrl: string;
  timeout?: number;
  headers?: { [key: string]: string };
}
