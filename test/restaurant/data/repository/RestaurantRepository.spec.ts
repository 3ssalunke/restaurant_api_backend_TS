import { Mongoose } from "mongoose";
import "dotenv/config";
import RestaurantRepository from "../../../../src/restaurant/data/repository/RestaurantRepository";
import { cleanUpDB, prepareDb } from "../helpers/helpers";
import { expect } from "chai";
import { Location } from "../../../../src/restaurant/domain/Restaurant";

describe("RestaurantRepository", () => {
  let client: Mongoose;
  let sut: RestaurantRepository;

  beforeEach(() => {
    client = new Mongoose();
    const connectionStr = process.env.DB_URI as string;
    client.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    sut = new RestaurantRepository(client);
  });

  afterEach(() => {
    client.disconnect();
  });

  describe("findAll", () => {
    beforeEach(async () => {
      await prepareDb(client);
    });

    afterEach(async () => {
      await cleanUpDB(client);
    });

    it("should return restaurants", async () => {
      const result = await sut.findAll(1, 2);

      expect(result).to.be.not.empty;
      expect(result.data.length).eq(2);
    });
  });

  describe("findOne", () => {
    let insertedId = "";
    beforeEach(async () => {
      const docs = await prepareDb(client);
      insertedId = docs[0].id;
    });

    afterEach(async () => {
      await cleanUpDB(client);
    });

    it("should return promise reject with error message", async () => {
      await sut.findOne("insertedId").catch((err) => {
        expect(err).to.be.not.empty;
      });
    });

    it("should return restaurants", async () => {
      const result = await sut.findOne(insertedId);

      expect(result.id).eq(insertedId);
    });
  });

  describe("findByLocation", () => {
    beforeEach(async () => {
      await prepareDb(client);
    });

    afterEach(async () => {
      await cleanUpDB(client);
    });

    it("should return promise reject with error message", async () => {
      const location = new Location(12.12, 22.22);
      await sut.findByLocation(location, 1, 2).catch((err) => {
        expect(err).to.be.not.empty;
      });
    });

    it("should return restaurants", async () => {
      const location = new Location(40.33, 73.23);
      const results = await sut.findByLocation(location, 1, 2);

      expect(results.data.length).eq(2);
    });
  });

  describe("search", () => {
    beforeEach(async () => {
      await prepareDb(client);
    });

    afterEach(async () => {
      await cleanUpDB(client);
    });

    it("should return promise reject with error message when no restaurant is found", async () => {
      const query = "not present";
      await sut.search(1, 2, query).catch((err) => {
        expect(err).to.be.not.empty;
      });
    });

    it("should return restaurants that matches query string", async () => {
      const query = "restaurant name";
      const results = await sut.search(1, 2, query);

      expect(results.data.length).eq(2);
    });
  });

  describe("getMenus", () => {
    let insertedId = "";
    beforeEach(async () => {
      const docs = await prepareDb(client);
      insertedId = docs[0].id;
    });

    afterEach(async () => {
      await cleanUpDB(client);
    });

    it("should return restaurant menus", async () => {
      const menus = await sut.getMenus(insertedId);
      // console.log(menus);
      expect(menus.length).to.eq(1);
      expect(menus[0].items.length).to.eq(2);
    });
  });
});
