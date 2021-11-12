import { Mongoose } from "mongoose";
import {
  IMenuDoc,
  IMenuItemDoc,
  IMenuItemModel,
  IMenuModel,
  menuItemSchema,
  menuSchema,
} from "../../../../src/restaurant/data/models/MenuModel";
import restaurantSchema, {
  IRestaurantDoc,
  IRestaurantModel,
} from "../../../../src/restaurant/data/models/RestaurantModel";

const restaurants = [
  {
    name: "Restuarant Name",
    type: "Fast Food",
    rating: 4.5,
    display_img_url: "restaurant.jpg",
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: "Road 1",
      city: "City",
      zipcode: "111111",
    },
  },
  {
    name: "Restuarant Name",
    type: "Fast Food",
    rating: 4.5,
    display_img_url: "restaurant.jpg",
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: "Road 1",
      city: "City",
      parish: "Parish",
      zipcode: "111111",
    },
  },
  {
    name: "Restuarant Name",
    type: "Fast Food",
    rating: 4.5,
    display_img_url: "restaurant.jpg",
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: "Road 1",
      city: "City",
      parish: "Parish",
      zipcode: "111111",
    },
  },
  {
    name: "Restuarant Name",
    type: "Fast Food",
    rating: 4.5,
    display_img_url: "restaurant.jpg",
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: "Road 1",
      city: "City",
      parish: "Parish",
      zipcode: "111111",
    },
  },
  {
    name: "Restuarant Name",
    type: "Fast Food",
    rating: 4.5,
    display_img_url: "restaurant.jpg",
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: "Road 1",
      city: "City",
      parish: "Parish",
      zipcode: "111111",
    },
  },
];

const menus = [
  {
    name: "Lunch",
    description: "a fun menu",
    image_url: "menu.jpg",
  },
];

const menuItems = [
  {
    name: "nuff food",
    description: "awasome!!",
    image_urls: ["url1", "url2"],
    unit_price: 12.99,
  },
  {
    name: "nuff food",
    description: "awasome!!",
    image_urls: ["url1", "url2"],
    unit_price: 12.99,
  },
];

async function insertMenus(
  restaurantsDocs: IRestaurantDoc[],
  menuModel: IMenuModel
) {
  const restaurnatMenus: Array<{}> = [];
  restaurantsDocs.map((res) => {
    const menusWithRestaurantId = menus.map((menu) => {
      return { restaurant_id: res.id, ...menu };
    });
    restaurnatMenus.push(...menusWithRestaurantId);
  });

  const menuDocs = await menuModel.insertMany(restaurnatMenus);
  return menuDocs;
}

async function insertMenuItems(
  menuDocs: IMenuDoc[],
  menuItemModel: IMenuItemModel
) {
  const items: Array<{}> = [];
  menuDocs.map((menu) => {
    const itemsWithMenuId = menuItems.map((item) => {
      return { menu_id: menu.id, ...item };
    });

    items.push(...itemsWithMenuId);
  });

  await menuItemModel.insertMany(items);
}

export const prepareDb = async (
  client: Mongoose
): Promise<IRestaurantDoc[]> => {
  const model = client.model<IRestaurantDoc>(
    "Restaurant",
    restaurantSchema
  ) as IRestaurantModel;

  const menuModel = client.model<IMenuDoc>("Menu", menuSchema) as IMenuModel;

  const menuItemModel = client.model<IMenuItemDoc>(
    "Menu_Item",
    menuItemSchema
  ) as IMenuItemModel;

  await model.ensureIndexes();
  const restaurantDocs = await model.insertMany(restaurants);
  const menuDocs = await insertMenus(restaurantDocs, menuModel);
  await insertMenuItems(menuDocs, menuItemModel);

  return restaurantDocs;
};

export const cleanUpDB = async (client: Mongoose) => {
  await client.connection.db.dropCollection("restaurants");
  await client.connection.db.dropCollection("menus");
  await client.connection.db.dropCollection("menu_items");
};
