import { Document, Model, Schema } from "mongoose";

export interface IMenuDoc extends Document {
  name: string;
  description: string;
  image_url: string;
  restaurant_id: string;
}

export interface IMenuItemDoc extends Document {
  name: string;
  description: string;
  image_urls: string[];
  menu_id: string;
  unit_price: number;
}

export interface IMenuModel extends Model<IMenuDoc> {}
export interface IMenuItemModel extends Model<IMenuItemDoc> {}

const menuItemSchema = new Schema({
  name: { type: String, required: true },
  menu_id: { type: String, required: true },
  description: { type: String, required: true },
  image_urls: { type: [String] },
  unit_price: { type: Number, required: true },
});

const menuSchema = new Schema({
  name: { type: String, required: true },
  restaurant_id: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String },
});

export { menuSchema, menuItemSchema };
