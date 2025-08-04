"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWidgetController = void 0;
const ErrorApi_1 = require("../utils/ErrorApi");
const UserWidgetService_1 = require("../services/UserWidgetService");
class UserWidgetController {
    static getWidget(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                if (!id || typeof id !== "string") {
                    throw new ErrorApi_1.ApiError(400, true, "Missing or invalid `id` query param", "Invalid widget ID");
                }
                const queries = req.query;
                const fullMadeWidget = yield UserWidgetService_1.UserWidgetService.widgetConstructor(Object.assign(Object.assign({}, queries), { live: queries.live === "true" }));
                res.set("Cache-Control", "s-maxage=1, stale-while-revalidate");
                res.set("Content-Type", "image/svg+xml");
                res.status(200).send(fullMadeWidget);
            }
            catch (error) {
                next(ErrorApi_1.ApiError.catchError(error, "UserWidgetError"));
            }
        });
    }
}
exports.UserWidgetController = UserWidgetController;
