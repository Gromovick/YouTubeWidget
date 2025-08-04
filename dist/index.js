"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
dotenv_1.default.config();
// router
const widgetRoute_1 = __importDefault(require("./src/routes/widgetRoute"));
// middlewares
// import notFoundMiddleware from "./middleware/not-found";
const errorMiddleware_1 = require("./src/middlewares/errorMiddleware");
app.set("trust proxy", 1);
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)());
app.use(helmet_1.default.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        "img-src": ["'self'", "https: data:"],
        "style-src": ["*", "'unsafe-inline'"],
    },
}));
app.use(widgetRoute_1.default);
// app.use(notFoundMiddleware);
app.use(errorMiddleware_1.errorHandler);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = app;
