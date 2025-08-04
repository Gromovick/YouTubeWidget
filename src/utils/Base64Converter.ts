import axios from "axios";
import fs from "fs";

export class Base64Converter {
  static fromFileSync(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString("base64");
  }
  static async fromUrl(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"];
    const base64 = Buffer.from(response.data).toString("base64");
    return `data:${contentType};base64,${base64}`;
  }
}
