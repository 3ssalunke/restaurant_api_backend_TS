import IAuthRepository from "../domain/IAuthRepository";
import IPasswordService from "../services/IPasswordService";

export default class SignUpUseCase {
  constructor(
    private authRepo: IAuthRepository,
    private passwordService: IPasswordService
  ) {}

  public async execute(
    name: string,
    authType: string,
    email: string,
    password: string
  ): Promise<string> {
    const user = await this.authRepo.find(email).catch(() => null);

    if (user) return Promise.reject("User already exists");

    const hashPassword = await this.passwordService.hash(password);
    const userId = await this.authRepo.add(name, email, authType, hashPassword);

    return userId;
  }
}
