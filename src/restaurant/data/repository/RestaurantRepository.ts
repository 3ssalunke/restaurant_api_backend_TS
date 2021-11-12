import { Mongoose, PaginateResult } from "mongoose";
import IRestaurantRepository from "../../domain/IRestaurantRespository";
import { Menu, MenuItem } from "../../domain/Menu";
import Pageable from "../../domain/Pageable";
import Restaurant, { Location } from "../../domain/Restaurant";
import {
  IMenuDoc,
  IMenuItemDoc,
  IMenuItemModel,
  IMenuModel,
  menuItemSchema,
  menuSchema,
} from "../models/MenuModel";
import restaurantSchema, {
  IRestaurantDoc,
  IRestaurantModel,
} from "../models/RestaurantModel";

export default class RestaurantRepository implements IRestaurantRepository {
  constructor(private readonly client: Mongoose) {}
  public async findAll(
    page: number,
    pageSize: number
  ): Promise<Pageable<Restaurant>> {
    const model = this.client.model<IRestaurantDoc>(
      "Restaurant",
      restaurantSchema
    ) as IRestaurantModel;

    const results = await model.paginate({}, { page, limit: pageSize });
    return this.restaurantsFromPageResults(results);
  }

  public async findOne(id: string): Promise<Restaurant> {
    const model = this.client.model<IRestaurantDoc>(
      "Restaurant",
      restaurantSchema
    ) as IRestaurantModel;

    const restaurant = await model.findById(id);
    if (restaurant === null) return Promise.reject("restuarant not found");

    return new Restaurant(
      restaurant.id,
      restaurant.name,
      restaurant.type,
      restaurant.rating,
      restaurant.display_img_url,
      restaurant.address,
      restaurant.location.coordinates
    );
  }

  public async findByLocation(
    location: Location,
    page: number,
    pageSize: number
  ): Promise<Pageable<Restaurant>> {
    const model = this.client.model<IRestaurantDoc>(
      "Restaurant",
      restaurantSchema
    ) as IRestaurantModel;

    const pageOptions = { page, limit: pageSize, forceCountFn: true };
    const geoQuery = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
          $maxDistance: 2,
        },
      },
    };

    const results = await model
      .paginate(geoQuery, pageOptions)
      .catch(() => null);

    return this.restaurantsFromPageResults(results);
  }

  public async search(
    page: number,
    pageSize: number,
    query: string
  ): Promise<Pageable<Restaurant>> {
    const model = this.client.model<IRestaurantDoc>(
      "Restaurant",
      restaurantSchema
    ) as IRestaurantModel;

    const pageOptions = { page, limit: pageSize };
    const textQuery = { $text: { $search: query } };

    const results = await model
      .paginate(textQuery, pageOptions)
      .catch(() => null);

    return this.restaurantsFromPageResults(results);
  }

  public async getMenus(restaurantId: string): Promise<Menu[]> {
    const menuModel = this.client.model<IMenuDoc>(
      "Menu",
      menuSchema
    ) as IMenuModel;

    const menuItemModel = this.client.model<IMenuItemDoc>(
      "Menu_Item",
      menuItemSchema
    ) as IMenuItemModel;

    const menus = await menuModel
      .find({ restaurant_id: restaurantId })
      .catch((_) => null);

    if (menus === null) {
      return Promise.reject("No menus found");
    }

    const menuIds = menus.map((menu) => menu.id);

    const items = await menuItemModel
      .find({ menu_id: { $in: menuIds } })
      .catch((_) => null);

    return this.menuWithMenuItems(menus, items!);
  }

  private restaurantsFromPageResults(
    pageResults: PaginateResult<IRestaurantDoc> | null
  ) {
    if (pageResults === null || pageResults.docs.length === 0) {
      return Promise.reject("restaurants not found");
    }

    const results = pageResults.docs.map<Restaurant>((model) => {
      return new Restaurant(
        model.id,
        model.name,
        model.type,
        model.rating,
        model.display_img_url,
        model.address,
        model.location.coordinates
      );
    });

    return new Pageable<Restaurant>(
      pageResults.page ?? 0,
      pageResults.limit,
      pageResults.totalPages,
      results
    );
  }

  private menuWithMenuItems(menus: IMenuDoc[], items: IMenuItemDoc[]): Menu[] {
    return menus.map((menu) => {
      return new Menu(
        menu.id,
        menu.restaurant_id,
        menu.name,
        menu.image_url,
        menu.description,
        items
          .filter((item) => item.menu_id === menu.id)
          .map((item) => {
            return new MenuItem(
              item.id,
              item.menu_id,
              item.name,
              item.description,
              item.image_urls,
              item.unit_price
            );
          })
      );
    });
  }
}
