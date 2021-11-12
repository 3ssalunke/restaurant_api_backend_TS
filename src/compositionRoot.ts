import { Mongoose } from "mongoose";
import { createClient, RedisClient } from "redis";
import AuthRepository from "./auth/data/repository/AuthRepository";
import BcryptPasswordService from "./auth/data/services/BcryptPasswordService";
import JwtTokenService from "./auth/data/services/JwtTokenService";
import RedisTokenStore from "./auth/data/services/RedisTokenStore";
import AuthRouter from "./auth/entrypoint/AuthRouter";
import TokenValidator from "./auth/helpers/TokenValidator";
import RestaurantRepository from "./restaurant/data/repository/RestaurantRepository";
import RestaurantRouter from "./restaurant/entrypoint/RestaurantRouter";

export default class CompositionRoot {
  private static client: Mongoose;
  private static redisClient: RedisClient;

  public static configure() {
    this.redisClient = createClient();
    this.client = new Mongoose();
    const connectionStr = process.env.DB_URI as string;
    this.client.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db connected");
  }

  public static authRouter() {
    const repository = new AuthRepository(this.client);
    const tokenService = new JwtTokenService(process.env.PRIVATE_KEY as string);
    const passwordService = new BcryptPasswordService(10);
    const tokenStore = new RedisTokenStore(this.redisClient);
    const tokenValidator = new TokenValidator(tokenService, tokenStore);

    return AuthRouter.configure(
      repository,
      tokenService,
      tokenStore,
      passwordService,
      tokenValidator
    );
  }

  public static restaurantRouter() {
    const repository = new RestaurantRepository(this.client);
    const tokenService = new JwtTokenService(process.env.PRIVATE_KEY as string);
    const tokenStore = new RedisTokenStore(this.redisClient);
    const tokenValidator = new TokenValidator(tokenService, tokenStore);

    return RestaurantRouter.configure(repository, tokenValidator);
  }
}
