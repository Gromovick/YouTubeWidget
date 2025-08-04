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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = defaults;
const Base64Converter_1 = require("./Base64Converter");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const rootDirectory = "../../public";
function defaults() {
    return __awaiter(this, void 0, void 0, function* () {
        const videoDefault = yield imageFileToBase64Url("video.jpg", rootDirectory);
        const bannerDefault = yield imageFileToBase64Url("banner.jpg", rootDirectory);
        const youtubeSvg = yield imageFileToBase64Url("youtube.svg", rootDirectory);
        const btnGradient = yield imageFileToBase64Url("gradient.webp", rootDirectory);
        const error404 = yield imageFileToBase64Url("404.svg", rootDirectory);
        return {
            videoDefault,
            bannerDefault,
            youtubeSvg,
            btnGradient,
            error404,
        };
    });
}
function imageFileToBase64Url() {
    return __awaiter(this, arguments, void 0, function* (file = "video.jpg", dirPath = "../../public/") {
        const filePath = path_1.default.join(__dirname, ...dirPath.split("/"), file);
        const fileType = file.split(".")[1];
        const base64Data = Base64Converter_1.Base64Converter.fromFileSync(filePath);
        const types = yield fs_1.default.promises.readFile("public/mimeTypes.json", "utf-8");
        const typesObject = JSON.parse(types);
        return `data:${typesObject[fileType]};base64, ${base64Data}`;
    });
}
