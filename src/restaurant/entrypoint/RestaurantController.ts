import { query, Request, Response } from "express";
import IRestaurantRepository from "../domain/IRestaurantRespository";
import { Location } from "../domain/Restaurant";

export default class RestaurantController {
  constructor(private readonly resRepo: IRestaurantRepository) {}

  public async findAll(req: Request, res: Response) {
    try {
      const { page, limit } = { ...req.query } as { page: any; limit: any };
      return this.resRepo
        .findAll(parseInt(page), parseInt(limit))
        .then((pageable) => {
          return res.status(200).json({
            metadata: {
              page: pageable.page,
              pageSize: pageable.pageSize,
              totalPages: pageable.pageNumber,
            },
            restaurants: pageable.data,
          });
        })
        .catch((err: Error) => res.status(400).json({ error: err.message }));
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  public async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      return this.resRepo
        .findOne(id)
        .then((restaurant) => res.status(200).json(restaurant))
        .catch((err: Error) => res.status(404).json({ error: err.message }));
    } catch (error) {
      return res.status(404).json({ error });
    }
  }

  public async findByLocation(req: Request, res: Response) {
    try {
      const { page, limit, longitude, latitude } = req.query as {
        page: string;
        limit: string;
        longitude: string;
        latitude: string;
      };

      const location = new Location(
        parseFloat(longitude),
        parseFloat(latitude)
      );
      return this.resRepo
        .findByLocation(location, parseInt(page), parseInt(limit))
        .then((pageable) => {
          return res.status(200).json({
            metadata: {
              page: pageable.page,
              pageSize: pageable.pageSize,
              totalPages: pageable.pageNumber,
            },
            restaurants: pageable.data,
          });
        })
        .catch((err: Error) => res.status(400).json({ error: err.message }));
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  public async search(req: Request, res: Response) {
    try {
      const { page, limit, query } = req.query as {
        page: string;
        limit: string;
        query: string;
      };

      return this.resRepo
        .search(parseInt(page), parseInt(limit), query)
        .then((pageable) => {
          return res.status(200).json({
            metadata: {
              page: pageable.page,
              pageSize: pageable.pageSize,
              totalPages: pageable.pageNumber,
            },
            restaurants: pageable.data,
          });
        })
        .catch((err: Error) => res.status(400).json({ error: err.message }));
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  public async getMenus(req: Request, res: Response) {
    try {
      const { id } = req.params;

      return this.resRepo
        .getMenus(id)
        .then((menus) => {
          return res.status(200).json({
            menu: menus,
          });
        })
        .catch((err: Error) => res.status(400).json({ error: err.message }));
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}
