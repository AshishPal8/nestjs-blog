import imagekit from "imagekit";
import { envConfig } from "./env.config";

export const imagekitInstance = new imagekit({
  publicKey: envConfig.imagekit.publicKey,
  privateKey: envConfig.imagekit.privateKey,
  urlEndpoint: envConfig.imagekit.urlEndpoint,
});
