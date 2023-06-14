export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: T | string;
  public errorCode: number;
  public _value: T;

  public constructor(
    isSuccess: boolean,
    error?: T | string,
    errorCode?: number,
    value?: T
  ) {
    if (isSuccess && error) {
      throw new Error(
        "InvalidOperation: A result cannot be successful and contain an error"
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        "InvalidOperation: A failing result needs to contain an error message"
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error!;
    this._value = value!;
    this.errorCode = errorCode!;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      console.log(this.error);

      throw new Error(String(this.error));
    }

    return this._value;
  }

  public getErrorValue(): T {
    return this.error as T;
  }

  public getErrorCode(): number {
    return this.errorCode;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, undefined, value);
  }

  public static fail<U>(error: string | U, errorCode?: number): Result<U> {
    return new Result<U>(false, error, errorCode);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (let result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}

export type Either<L, A> = Left<L, A> | Right<L, A>;

export class Left<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return true;
  }

  isRight(): this is Right<L, A> {
    return false;
  }
}

export class Right<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return false;
  }

  isRight(): this is Right<L, A> {
    return true;
  }
}

export const left = <L, A>(l: L): Either<L, A> => {
  return new Left(l);
};

export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a);
};
