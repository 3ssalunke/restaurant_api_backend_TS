import { Router } from "express";
import { Request, Response } from "express-serve-static-core";
import IAuthRepository from "../domain/IAuthRepository";
import TokenValidator from "../helpers/TokenValidator";
import {
  signInValidationRules,
  signUpValidationRules,
  validate,
} from "../helpers/Validators";
import IPasswordService from "../services/IPasswordService";
import ITokenService from "../services/ITokenService";
import ITokenStore from "../services/ITokenStore";
import SignInUseCase from "../useCases/SignInUseCase";
import SignOutUseCase from "../useCases/SignOutUseCase";
import SignUpUseCase from "../useCases/SignupUseCase";
import { AuthController } from "./AuthController";

export default class AuthRouter {
  public static configure(
    authRepo: IAuthRepository,
    tokenService: ITokenService,
    tokenStore: ITokenStore,
    passwordService: IPasswordService,
    tokenValidator: TokenValidator
  ): Router {
    const router = Router();
    let controller = AuthRouter.composeController(
      authRepo,
      tokenService,
      tokenStore,
      passwordService
    );

    router.post(
      "/signin",
      signInValidationRules(),
      validate,
      (req: Request, res: Response) => controller.signin(req, res)
    );
    router.post(
      "/signup",
      signUpValidationRules(),
      validate,
      (req: Request, res: Response) => controller.signup(req, res)
    );
    router.get(
      "/signout",
      (req, res, next) => tokenValidator.validate(req, res, next),
      (req: Request, res: Response) => controller.signout(req, res)
    );
    return router;
  }

  private static composeController(
    authRepo: IAuthRepository,
    tokenService: ITokenService,
    tokenStore: ITokenStore,
    passwordService: IPasswordService
  ): AuthController {
    const signInUseCase = new SignInUseCase(authRepo, passwordService);
    const signUpUseCase = new SignUpUseCase(authRepo, passwordService);
    const signOutUseCase = new SignOutUseCase(tokenStore);
    const controller = new AuthController(
      signInUseCase,
      signUpUseCase,
      signOutUseCase,
      tokenService
    );
    return controller;
  }
}
