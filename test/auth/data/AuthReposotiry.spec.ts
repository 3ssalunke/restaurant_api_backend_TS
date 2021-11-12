import { Mongoose } from "mongoose";
import "mocha";
import { expect } from "chai";
import "dotenv/config";
import AuthRepository from "../../../src/auth/data/repository/AuthRepository";

describe("AuthRespository", () => {
  let client: Mongoose;
  let sut: AuthRepository;

  beforeEach(() => {
    client = new Mongoose();
    const connectionStr = process.env.DB_URI as string;
    client.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    sut = new AuthRepository(client);
  });

  afterEach(() => {
    client.disconnect();
  });

  it("should return user when email is found", async () => {
    const email = "test@test.com";

    const result = await sut.find(email);

    expect(result).to.not.be.empty;
  });

  it("should return user id when user is added to db", async () => {
    const user = {
      name: "John Flyn",
      email: "lyn@mail.com",
      password: "pass232",
      type: "email",
    };

    const result = await sut
      .add(user.name, user.email, user.type, user.password)
      .catch(() => null);

    expect(result).to.not.be.empty;
  });
});
