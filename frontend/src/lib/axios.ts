import axios from "axios";
import { envConfig } from "../config/env.config";

export const api = axios.create({
  baseURL: envConfig.apiUrl,
  withCredentials: true,
});
