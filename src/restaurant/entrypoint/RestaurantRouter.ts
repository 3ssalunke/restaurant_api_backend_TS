import { Router } from "express";
import TokenValidator from "../../auth/helpers/TokenValidator";
import IRestaurantRepository from "../domain/IRestaurantRespository";
import RestaurantController from "./RestaurantController";

export default class RestaurantRouter {
  public static configure(
    resRepo: IRestaurantRepository,
    tokenValidator: TokenValidator
  ): Router {
    const router = Router();
    let controller = new RestaurantController(resRepo);

    router.get(
      "/",
      (req, res, next) => tokenValidator.validate(req, res, next),
      (req, res) => controller.findAll(req, res)
    );

    router.get(
      "/restaurant/:id",
      (req, res, next) => tokenValidator.validate(req, res, next),
      (req, res) => controller.findOne(req, res)
    );

    router.get(
      "/location",
      (req, res, next) => tokenValidator.validate(req, res, next),
      (req, res) => controller.findByLocation(req, res)
    );

    router.get(
      "/search",
      (req, res, next) => tokenValidator.validate(req, res, next),
      (req, res) => controller.search(req, res)
    );

    router.get(
      "/restaurant/:id/menu",
      (req, res, next) => tokenValidator.validate(req, res, next),
      (req, res) => controller.getMenus(req, res)
    );

    return router;
  }
}
