"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserWidgetController_1 = require("../controllers/UserWidgetController");
const router = express_1.default.Router();
router.route("/").get(UserWidgetController_1.UserWidgetController.getWidget);
exports.default = router;
