import { ValueObject } from "../../../../core/domain/ValueObject";
import { Guard } from "../../../../core/logic/Guard";
import { Result } from "../../../../core/logic/Result";

interface ColorProps {
  value: string;
}

export class Color extends ValueObject<ColorProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ColorProps) {
    super(props);
  }

  public static create(color: string): Result<Color> {
    if (color == "" || !color) {
      return Result.ok<Color>(new Color({ value: "" }));
    }
    console.log("HERE =>" + color + "END");
    if (!this.isHex(color) && color != "NONE") {
      return Result.fail<Color>("Invalid color");
    }

    return Result.ok<Color>(new Color({ value: color }));
  }

  private static isHex(str: string): boolean {
    const hexRegExp = /^[0-9A-Fa-f]+$/g;
    return hexRegExp.test(str);
  }
}
