import * as bcrypt from "bcrypt";

export class EncryptUtils {
  static async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  }

  static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const passwordMatches = await bcrypt.compare(plainPassword, hashedPassword);
    return passwordMatches;
  }
}
