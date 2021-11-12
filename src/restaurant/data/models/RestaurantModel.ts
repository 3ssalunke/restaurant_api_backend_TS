import { Document, PaginateModel, Schema } from "mongoose";
import pagination from "mongoose-paginate-v2";
import { Address, Location } from "../../domain/Restaurant";

export interface IRestaurantDoc extends Document {
  name: string;
  type: string;
  rating: number;
  display_img_url: string;
  location: { coordinates: Location };
  address: Address;
}

export interface IRestaurantModel extends PaginateModel<IRestaurantDoc> {}

const pointSchema = new Schema({
  type: {
    type: String,
    default: "Point",
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    required: true,
  },
});

const restaurantSchema = new Schema({
  name: { type: String, required: true, index: "text" },
  type: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  display_img_url: { type: String, required: true },
  location: {
    type: pointSchema,
    index: "2dsphere",
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: { type: String, required: true },
  },
});

restaurantSchema.plugin(pagination);
export default restaurantSchema;
