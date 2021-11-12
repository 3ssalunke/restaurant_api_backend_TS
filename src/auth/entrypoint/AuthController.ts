import { Request, Response } from "express";
import ITokenService from "../services/ITokenService";
import SignInUseCase from "../useCases/SignInUseCase";
import SignOutUseCase from "../useCases/SignOutUseCase";
import SignUpUseCase from "../useCases/SignupUseCase";

export class AuthController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signOutUseCase: SignOutUseCase,
    private readonly tokenService: ITokenService
  ) {}

  public async signin(req: Request, res: Response) {
    try {
      const { name, email, password, auth_type } = req.body;
      return this.signInUseCase
        .execute(name, email, password, auth_type)
        .then((userId) => {
          return res.json({ auth_token: this.tokenService.encode(userId) });
        })
        .catch((err: Error) => {
          return res.status(404).json({ error: err.message });
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  public async signup(req: Request, res: Response) {
    try {
      const { name, email, password, auth_type } = req.body;
      return this.signUpUseCase
        .execute(name, auth_type, email, password)
        .then((userId) => {
          return res.json({ auth_token: this.tokenService.encode(userId) });
        })
        .catch((err: Error) => {
          return res.status(404).json({ error: err.message });
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  public async signout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;
      return this.signOutUseCase
        .execute(token)
        .then((result) => {
          return res.json({ messsage: result });
        })
        .catch((err: Error) => {
          return res.status(404).json({ error: err.message });
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }
}
