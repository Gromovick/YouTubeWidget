import { Base64Converter } from "./Base64Converter";
import path from "path";
import fs from "fs";

const rootDirectory = "../../public";

export async function defaults() {
  const videoDefault = await imageFileToBase64Url("video.jpg", rootDirectory);
  const bannerDefault = await imageFileToBase64Url("banner.jpg", rootDirectory);
  const youtubeSvg = await imageFileToBase64Url("youtube.svg", rootDirectory);
  const btnGradient = await imageFileToBase64Url(
    "gradient.webp",
    rootDirectory
  );
  const error404 = await imageFileToBase64Url("404.svg", rootDirectory);

  return {
    videoDefault,
    bannerDefault,
    youtubeSvg,
    btnGradient,
    error404,
  };
}

async function imageFileToBase64Url(
  file = "video.jpg",
  dirPath = "../../public/"
) {
  const filePath = path.join(__dirname, ...dirPath.split("/"), file);
  const fileType = file.split(".")[1];
  const base64Data = Base64Converter.fromFileSync(filePath);
  const types = await fs.promises.readFile("../../public/mimeTypes.json", "utf-8");
  const typesObject = JSON.parse(types);
  return `data:${typesObject[fileType]};base64, ${base64Data}`;
}
