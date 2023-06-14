
export interface Repo<T> {
  exists (t: any): Promise<boolean>;
  save (t: T): Promise<T>;
}