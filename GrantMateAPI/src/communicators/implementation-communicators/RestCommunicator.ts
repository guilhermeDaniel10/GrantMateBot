import axios, { AxiosResponse, AxiosError } from "axios";
import { ICommunicatorOptionsDTO } from "../../dto/ICommunicatorOptionsDTO";
import { IRequestDTO } from "../../dto/IRequestDTO";
import { IResponseDTO } from "../../dto/IResponseDTO";
import { Service } from "typedi";
import IRestCommunicator from "../interface-communicators/IRestCommunicator";

interface CommunicatorError {
  message: string;
  status: number;
}

@Service()
export class RestCommunicator implements IRestCommunicator {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly headers: { [key: string]: string };

  constructor(options: ICommunicatorOptionsDTO) {
    this.baseUrl = options.baseUrl;
    this.timeout = options.timeout ?? 120000;
    this.headers = options.headers ?? {};
  }

  public async sendRequest<T>(request: IRequestDTO): Promise<IResponseDTO<T>> {
    try {
      console.log(`${this.baseUrl}${request.url}`);
      console.log(request);
      const response: AxiosResponse<T> = await axios.post(
        `${this.baseUrl}${request.url}`,
        request.data,
        {
          timeout: this.timeout,
          headers: this.headers,
        }
      );

      return {
        data: response.data,
        status: response.status,
        success: response.status >= 200 && response.status < 300,
      };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const message = error.message ?? "Unknown error";
        const status = axiosError.response?.status ?? 500;
        throw {
          message,
          status,
          success: false,
        } as CommunicatorError;
      } else {
        throw {
          message: error.message ?? "Unknown error",
          status: 500,
          success: false,
        } as CommunicatorError;
      }
    }
  }

  public async sendGetRequest<T>(
    request: IRequestDTO
  ): Promise<IResponseDTO<T>> {
    try {
      const response: AxiosResponse<T> = await axios.get(
        `${this.baseUrl}${request.url}`,
        {
          timeout: this.timeout,
          headers: this.headers,
        }
      );

      return {
        data: response.data,
        status: response.status,
        success: response.status >= 200 && response.status < 300,
      };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const message = error.message ?? "Unknown error";
        const status = axiosError.response?.status ?? 500;
        throw {
          message,
          status,
          success: false,
        } as CommunicatorError;
      } else {
        throw {
          message: error.message ?? "Unknown error",
          status: 500,
          success: false,
        } as CommunicatorError;
      }
    }
  }
}
