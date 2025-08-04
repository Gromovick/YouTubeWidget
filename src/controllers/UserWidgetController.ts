import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ErrorApi";
import { UserWidgetService } from "../services/UserWidgetService";

export class UserWidgetController {
  static async getWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        throw new ApiError(
          400,
          true,
          "Missing or invalid `id` query param",
          "Invalid widget ID"
        );
      }
      const queries = req.query;
      const fullMadeWidget = await UserWidgetService.widgetConstructor({
        ...queries,
        live: queries.live === "true",
      });
      res.set("Cache-Control", "s-maxage=1, stale-while-revalidate");
      res.set("Content-Type", "image/svg+xml");
      res.status(200).send(fullMadeWidget);
    } catch (error) {
      next(ApiError.catchError(error, "UserWidgetError"));
    }
  }
}
