import { Result } from "../../../core/logic/Result";

abstract class DataReader<T> {
  public async readData(): Promise<T[]> {
    const data = await this.retrieveData();
    if (data.isFailure) {
      throw new Error(data.error.toString());
    }
    return data.getValue();
  }

  protected abstract retrieveData(): Promise<Result<T[]>>;
}

export default DataReader;

