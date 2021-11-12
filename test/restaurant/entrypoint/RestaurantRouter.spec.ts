import { expect } from "chai";
import express, { Application } from "express";
import { Mongoose } from "mongoose";
import request from "supertest";
import TokenValidator from "../../../src/auth/helpers/TokenValidator";
import ITokenService from "../../../src/auth/services/ITokenService";
import ITokenStore from "../../../src/auth/services/ITokenStore";
import { IRestaurantDoc } from "../../../src/restaurant/data/models/RestaurantModel";
import RestaurantRepository from "../../../src/restaurant/data/repository/RestaurantRepository";
import IRestaurantRepository from "../../../src/restaurant/domain/IRestaurantRespository";
import RestaurantRouter from "../../../src/restaurant/entrypoint/RestaurantRouter";
import { cleanUpDB, prepareDb } from "../data/helpers/helpers";

describe("RestaurantRouter", () => {
  let repository: IRestaurantRepository;
  let app: Application;

  let client: Mongoose;
  let savedRestaurants: IRestaurantDoc[];

  before(() => {
    client = new Mongoose();

    const connectionStr = process.env.DB_URI as string;
    client.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    repository = new RestaurantRepository(client);
    let tokenService = new FakeTokenService();
    let tokenStore = new FakeTokenStore();

    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
      "/restaurants",
      RestaurantRouter.configure(
        repository,
        new TokenValidator(tokenService, tokenStore)
      )
    );
  });

  beforeEach(async () => {
    savedRestaurants = await prepareDb(client);
  });

  afterEach(async () => {
    await cleanUpDB(client);
  });

  after(() => {
    client.disconnect();
  });

  it("returns 200 and list of restaurants", async () => {
    await request(app)
      .get("/restaurants?page=1&limit=2")
      .set("Authorization", "token")
      .expect(200)
      .then((res) => {
        expect(res.body.metadata).to.be.not.empty;
        expect(res.body.restaurants).to.not.be.empty;
      });
  });

  it("returns 200 and a restaurants", async () => {
    const id = savedRestaurants[0].id;
    await request(app)
      .get(`/restaurants/restaurant/${id}`)
      .set("Authorization", "token")
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.not.empty;
        expect(res.body.name).to.be.eq("Restuarant Name");
      });
  });

  it("returns 200 and list of restaurants by location", async () => {
    await request(app)
      .get(
        "/restaurants/location?page=1&limit=2&longitude=40.33&latitude=73.23"
      )
      .set("Authorization", "token")
      .expect(200)
      .then((res) => {
        expect(res.body.metadata).to.be.not.empty;
        expect(res.body.restaurants).to.not.be.empty;
      });
  });

  it("returns 200 and list of restaurants by search query", async () => {
    await request(app)
      .get("/restaurants/search?page=1&limit=2&query=name")
      .set("Authorization", "token")
      .expect(200)
      .then((res) => {
        expect(res.body.metadata).to.be.not.empty;
        expect(res.body.restaurants).to.not.be.empty;
      });
  });

  it("returns 200 and list of menu by restaurant's id", async () => {
    const id = savedRestaurants[0].id;
    await request(app)
      .get(`/restaurants/restaurant/${id}/menu`)
      .set("Authorization", "token")
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.not.empty;
        expect(res.body.menu).to.not.be.empty;
      });
  });
});

export default class FakeTokenService implements ITokenService {
  encode(payload: string | object): string | object {
    return payload;
  }
  decode(token: string | object): string | object {
    return token;
  }
}

class FakeTokenStore implements ITokenStore {
  save(token: string): void {
    console.log(token);
  }
  async get(token: string): Promise<string> {
    return "";
  }
}
