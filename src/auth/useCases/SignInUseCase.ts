import IAuthRepository from "../domain/IAuthRepository";
import IPasswordService from "../services/IPasswordService";

export default class SignInUseCase {
  constructor(
    private authRepo: IAuthRepository,
    private passwordService: IPasswordService
  ) {}

  public async execute(
    name: string,
    email: string,
    password: string,
    type: string
  ): Promise<string> {
    if (type === "email") return this.emailLogin(email, password);

    return this.oAuthLogin(name, email, type);
  }

  private async emailLogin(email: string, password: string): Promise<string> {
    const user = await this.authRepo.find(email).catch(() => null);
    if (
      !user ||
      !(await this.passwordService.compare(password, user.password))
    ) {
      return Promise.reject("Invalid email or password");
    }

    return user.id;
  }

  private async oAuthLogin(name: string, email: string, type: string) {
    const user = await this.authRepo.find(email).catch(() => null);
    if (user && user.type === "email") {
      return Promise.reject("account already exists, log in with password");
    }

    if (user) return user.id;

    const userId = await this.authRepo.add(name, email, type);
    return userId;
  }
}
