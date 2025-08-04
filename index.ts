import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

const app = express();
dotenv.config();

// router
import widgetRoute from "./src/routes/widgetRoute";

// middlewares
// import notFoundMiddleware from "./middleware/not-found";
import { errorHandler } from "./src/middlewares/errorMiddleware";
import path from "path";
import { Base64Converter } from "./src/utils/Base64Converter";

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"],
      "style-src": ["*", "'unsafe-inline'"],
    },
  })
);

app.use(widgetRoute);

// app.use(notFoundMiddleware);
app.use(errorHandler);

const port: number | string = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;


