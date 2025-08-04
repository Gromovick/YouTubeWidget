import express from "express";
import { UserWidgetController } from "../controllers/UserWidgetController";

const router = express.Router();

router.route("/").get(UserWidgetController.getWidget);

export default router;
