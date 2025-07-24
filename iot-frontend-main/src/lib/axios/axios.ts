import axios from "axios";

import { baseUrl } from "@/constants/urls";

export default axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
});

export const axiosAuth = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
});
